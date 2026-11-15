import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const JOB_IMAGE_BUCKET = "job-images";
export const JOB_IMAGE_LIMIT = 5 * 1024 * 1024;
export const JOB_IMAGE_TYPES: Partial<Record<string, string>> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export function JobImage({ path, className }: { path: string; className: string }) {
  const [image, setImage] = useState<{ path: string; url: string } | null>(null);

  useEffect(() => {
    let active = true;
    void supabase.storage.from(JOB_IMAGE_BUCKET).createSignedUrl(path, 900).then(({ data }) => {
      if (active && data) setImage({ path, url: data.signedUrl });
    });
    return () => { active = false; };
  }, [path]);

  if (image?.path !== path) return null;
  return <img src={image.url} alt="" loading="lazy" decoding="async" className={className} onError={() => setImage(null)} />;
}
