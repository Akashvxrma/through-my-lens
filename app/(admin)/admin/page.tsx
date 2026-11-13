import { createClient } from '@/lib/supabase/server';
import UploadForm from '@/components/admin/UploadForm';
import PhotoManagementTable from '@/components/admin/PhotoManagementTable';
import { Photo } from '@/types/photo';
import { USER_PHOTOS } from '@/lib/data/user-photos';

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const { data: photos, error } = await supabase
    .from('photos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching admin photos:', error);
  }

  const activePhotos = photos && photos.length > 0 ? (photos as Photo[]) : USER_PHOTOS;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold text-white">Photo Management</h1>
        <p className="text-sm text-neutral-400 mt-1">
          Upload new photographs to Supabase Storage and organize your visual portfolio.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <UploadForm />
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-xl font-medium text-white mb-4">
            Published Photos ({activePhotos.length})
          </h2>
          <PhotoManagementTable initialPhotos={activePhotos} />
        </div>
      </div>
    </div>
  );
}
