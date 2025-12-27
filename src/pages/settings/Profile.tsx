// src/pages/settings/Profile.tsx
import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUser } from '../../hooks/useUser';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { Loader, UploadCloud } from 'lucide-react';

// Schema for form validation
const profileSchema = z.object({
  fullName: z.string().min(3, 'Nama lengkap harus memiliki setidaknya 3 karakter.'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfileSettings() {
  const { user, loading: userLoading } = useUser();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const inputFileRef = useRef<HTMLInputElement>(null);
  
  const avatarUrl = user?.user_metadata?.avatar_url 
    ? `${user.user_metadata.avatar_url}?t=${new Date().getTime()}`
    : `https://api.dicebear.com/8.x/pixel-art/svg?seed=${user?.email}`;

  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { fullName: '' }
  });

  useEffect(() => {
    if (user) {
      setValue('fullName', user.user_metadata?.name || '');
    }
  }, [user, setValue]);

  const handleUpdateName = async (data: ProfileFormData) => {
    const { error } = await supabase.auth.updateUser({
      data: { name: data.fullName },
    });

    if (error) {
      toast.error('Gagal memperbarui nama: ' + error.message);
    } else {
      toast.success('Nama berhasil diperbarui!');
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast.error('Ukuran file maksimal adalah 2MB.');
        return;
      }
      setAvatarFile(file);
    }
  };

  const handleCancelUpload = () => {
    setAvatarFile(null);
    if (inputFileRef.current) {
      inputFileRef.current.value = '';
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile || !user) return;

    setIsUploading(true);
    const toastId = toast.loading('Mengunggah avatar...');
    
    const fileName = `${user.id}/${Date.now()}_${avatarFile.name}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, avatarFile, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      setIsUploading(false);
      toast.error('Gagal mengunggah avatar: ' + uploadError.message, { id: toastId });
      if (uploadError.message.includes("Bucket not found")) {
        toast.error("Admin: Pastikan bucket 'avatars' sudah dibuat di Supabase Storage dengan akses publik.", { duration: 10000 });
      }
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName);

    if (!publicUrl) {
      setIsUploading(false);
      toast.error('Gagal mendapatkan URL publik avatar.', { id: toastId });
      return;
    }

    const { error: updateUserError } = await supabase.auth.updateUser({
      data: { avatar_url: publicUrl },
    });

    if (updateUserError) {
      setIsUploading(false);
      toast.error('Gagal memperbarui profil: ' + updateUserError.message, { id: toastId });
    } else {
      toast.success('Avatar berhasil diperbarui!', { id: toastId });
      handleCancelUpload(); // Use the cancel handler to reset state
    }
    
    setIsUploading(false);
  };
  
  if (userLoading) {
      return (
        <div className="flex justify-center items-center h-40">
          <Loader className="animate-spin text-rose-500" />
        </div>
      );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-2">Profil Saya</h2>
      <p className="text-gray-400 mb-8">Perbarui informasi profil dan avatar Anda di sini.</p>
      
      <div className="mb-10 p-6 bg-gray-900/50 border border-gray-700 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-4">Avatar Profil</h3>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
              <img 
                  src={avatarFile ? URL.createObjectURL(avatarFile) : avatarUrl}
                  alt="Avatar" 
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-purple-500/20 border-4 border-purple-500 object-cover"
              />
              <div className="flex-grow text-center sm:text-left">
                  <label htmlFor="avatar-upload" className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-2 text-sm sm:text-base">
                      <UploadCloud size={18} />
                      Pilih Gambar
                  </label>
                  <input id="avatar-upload" type="file" className="hidden" accept="image/png, image/jpeg" onChange={handleAvatarChange} ref={inputFileRef} />
                  <p className="text-xs text-gray-400 mt-2 sm:mt-3">PNG atau JPG, maksimal 2MB.</p>

                  {avatarFile && (
                    <div className="mt-4 flex flex-col items-center gap-3 sm:gap-4 w-full">
                      <p className="text-sm text-gray-300 truncate max-w-xs">File: {avatarFile.name}</p>
                      <div className="flex items-center justify-center sm:justify-start gap-3">
                        <button
                          onClick={handleAvatarUpload}
                          disabled={isUploading}
                          className="flex items-center justify-center bg-gradient-to-r from-green-500 to-cyan-500 text-white font-bold px-4 py-2 rounded-lg shadow-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                        >
                          {isUploading ? <Loader className="animate-spin mr-2" size={16}/> : null}
                          {isUploading ? 'Mengunggah...' : 'Upload & Simpan'}
                        </button>
                        <button
                          onClick={handleCancelUpload}
                          disabled={isUploading}
                          className="bg-gray-700 text-gray-300 hover:bg-gray-600 font-bold px-4 py-2 rounded-lg text-sm sm:text-base transition-colors disabled:opacity-50"
                        >
                          Batal
                        </button>
                      </div>
                    </div>
                  )}
              </div>
          </div>
      </div>

      <form onSubmit={handleSubmit(handleUpdateName)} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
            Alamat Email
          </label>
          <input
            id="email"
            type="email"
            value={user?.email || ''}
            disabled
            className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-gray-400 cursor-not-allowed"
            aria-label="Alamat email tidak dapat diubah"
          />
        </div>

        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">
            Nama Lengkap
          </label>
          <input
            id="fullName"
            type="text"
            {...register('fullName')}
            placeholder="Masukkan nama lengkap Anda"
            className={`w-full px-4 py-3 bg-gray-800 border-2 rounded-lg text-white focus:outline-none focus:border-rose-500 transition-colors ${
              errors.fullName ? 'border-red-500' : 'border-gray-700'
            }`}
          />
          {errors.fullName && <p className="mt-2 text-sm text-red-400">{errors.fullName.message}</p>}
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center bg-gradient-to-r from-rose-600 to-purple-600 text-white font-bold px-6 py-3 rounded-lg shadow-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? <Loader className="animate-spin mr-2" size={20}/> : null}
            {isSubmitting ? 'Menyimpan...' : 'Simpan Nama'}
          </button>
        </div>
      </form>
    </div>
  );
}