import { useUser } from '@/utils/useUser';
import { useRouter } from 'next/router';

export default function UploadSongBtn(){
    const { user, setAuthOpenedFrom } = useUser();
    const router = useRouter();

    function handleUploadClick(){
        if (!user){
            setAuthOpenedFrom('uploadSongBtn');
            return;
        }

        router.push('/upload-info');
    }

    return (
        <div 
            onClick={handleUploadClick}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg shadow-md hover:shadow-lg cursor-pointer transition-all duration-200 p-6 text-center"
        >
            <div className="flex items-center justify-center mb-3">
                <svg className="w-8 h-8 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="text-white font-semibold text-lg">ატვირთვა</span>
            </div>
            
            <h3 className="text-white font-bold text-base mb-1">
                ატვირთე სიმღერები ან აკორდები
            </h3>
            <p className="text-white/90 text-sm">
                და გამოიმუშავე თანხე
            </p>
        </div>
    );
}