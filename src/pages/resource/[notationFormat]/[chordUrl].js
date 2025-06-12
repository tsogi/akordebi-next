import SongPage, { getServerSideProps as originalGetServerSideProps } from '@/pages/chord/[chordUrl]';
import { getNotation } from '@/utils/notations';

export default function ChordPageWithSegment(props) {
    return <SongPage {...props} />;
}

export async function getServerSideProps(ctx) {
    const { notationFormat, chordUrl } = ctx.params;
    
    // Get the notation based on the notation format
    const notation = getNotation(notationFormat);
    if (!notation) {
        return {
            notFound: true,
        };
    }

    // Call the original getServerSideProps with modified params
    const modifiedCtx = {
        ...ctx,
        params: {
            chordUrl,
            notationFormat: notation.code
        }
    };

    return originalGetServerSideProps(modifiedCtx);
} 