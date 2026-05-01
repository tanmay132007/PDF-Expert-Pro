-- PDF EXPERT PRO - STORAGE RECALCULATION TRIGGER

-- Function to recalculate a user's storage when a file is added, updated, or deleted
CREATE OR REPLACE FUNCTION public.recalculate_user_storage()
RETURNS TRIGGER AS $$
DECLARE
  v_user_id UUID;
  v_total_bytes BIGINT;
  v_total_mb FLOAT;
BEGIN
  -- Determine the user ID based on the operation
  IF TG_OP = 'DELETE' THEN
    v_user_id := OLD.user_id;
  ELSE
    v_user_id := NEW.user_id;
  END IF;

  -- Calculate the total size of files for this user that are NOT deleted
  SELECT COALESCE(SUM(size_bytes), 0)
  INTO v_total_bytes
  FROM public.files
  WHERE user_id = v_user_id AND is_deleted = FALSE;

  -- Convert to Megabytes
  v_total_mb := v_total_bytes::FLOAT / (1024.0 * 1024.0);

  -- Update the profiles table
  UPDATE public.profiles
  SET storage_used_mb = v_total_mb,
      updated_at = NOW()
  WHERE id = v_user_id;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger on the files table
DROP TRIGGER IF EXISTS trigger_recalculate_storage ON public.files;
CREATE TRIGGER trigger_recalculate_storage
  AFTER INSERT OR UPDATE OF size_bytes, is_deleted OR DELETE
  ON public.files
  FOR EACH ROW
  EXECUTE PROCEDURE public.recalculate_user_storage();
