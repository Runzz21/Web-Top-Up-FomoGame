// src/pages/settings/Security.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { Loader } from 'lucide-react';

const passwordSchema = z.object({
  newPassword: z.string().min(8, 'Kata sandi baru harus memiliki setidaknya 8 karakter.'),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Konfirmasi kata sandi tidak cocok.",
  path: ["confirmPassword"], // path of error
});

type PasswordFormData = z.infer<typeof passwordSchema>;

export default function SecuritySettings() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (data: PasswordFormData) => {
    const { error } = await supabase.auth.updateUser({
      password: data.newPassword,
    });

    if (error) {
      toast.error('Gagal memperbarui kata sandi: ' + error.message);
    } else {
      toast.success('Kata sandi berhasil diperbarui!');
      reset();
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-2">Keamanan Akun</h2>
      <p className="text-gray-400 mb-8">Ubah kata sandi Anda secara berkala untuk menjaga keamanan akun.</p>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-lg">
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-2">
            Kata Sandi Baru
          </label>
          <input
            id="newPassword"
            type="password"
            {...register('newPassword')}
            className={`w-full px-4 py-3 bg-gray-800 border-2 rounded-lg text-white focus:outline-none focus:border-rose-500 transition-colors ${
              errors.newPassword ? 'border-red-500' : 'border-gray-700'
            }`}
          />
          {errors.newPassword && <p className="mt-2 text-sm text-red-400">{errors.newPassword.message}</p>}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
            Konfirmasi Kata Sandi Baru
          </label>
          <input
            id="confirmPassword"
            type="password"
            {...register('confirmPassword')}
            className={`w-full px-4 py-3 bg-gray-800 border-2 rounded-lg text-white focus:outline-none focus:border-rose-500 transition-colors ${
              errors.confirmPassword ? 'border-red-500' : 'border-gray-700'
            }`}
          />
          {errors.confirmPassword && <p className="mt-2 text-sm text-red-400">{errors.confirmPassword.message}</p>}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center bg-gradient-to-r from-rose-600 to-purple-600 text-white font-bold px-6 py-3 rounded-lg shadow-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? <Loader className="animate-spin mr-2" size={20}/> : null}
            {isSubmitting ? 'Menyimpan...' : 'Ubah Kata Sandi'}
          </button>
        </div>
      </form>
    </div>
  );
}
