/*
 • Fitur By Anomaki Team
 • Created : xyzan code
 • Instagram Stalk ( *PlUGINS* )
 • Jangan Hapus Wm
 • https://whatsapp.com/channel/0029Vaio4dYC1FuGr5kxfy2l
 
 USINH WEB : https://views4you.com/tools/instagram-follower-count/
 > *NOTE : UNTUK SAAT INI FITUR MASIH BERFUNGSI:>*
*/

import axios from 'axios';
import qs from 'qs';
let handler = async (m, {
    text,
    conn
}) => {
    if (!text) return m.reply('Masukkan username Instagram.\n\nKagak usah make *@*');

    const inti = qs.stringify({
        action: 'wcl_insta_follower_count_checker',
        token: '03AFcWeA5P66gJ13Zveu8aKFaBTaCbolEYory-EhTpqfsAOGPBPsVqu-xhJE5GKWEy8djupb9Oj8D5J3ShTKECuMQuwFX1ikVt1LGtbhTcKFCo9hxbTA89xX3grIZpkdmhGK7aVd2HW-KCGdcudwFnqRtxhDAERI2a1o_D_W8LVOR9KTLRWTnid8pTIxMs9Mm3mTu9RRdS7A2hZ8RQ7kXsgB0dDxhY_nBLGcqGyvvgFmBXapBx3B9SRUl6OoA_-AuvaFVtTPbbvp_04Ha8Atp2DwVBYv_X8o6WM3a3saCIfwRR1Nntr2zNhuDzfW_EbWFB_j1GtNz1cbeVVdBecfUOzOGIuWl6b0xmRPcBsNQdfzFNAqMqAgTxnP7FACvaDIqfq2Tj_ds1jrTJQ6C33JNyxZNLO9kA8LuQcG7HQE3rrKJMX5d8STps1wVFTKS_DmM6GFwqOJpg8fqz4jU-DKUQxRczKffSfMpTorxMG7fHZmhy-tJYQKnR_CZ10YYhzxcaNrtlnZBlSjsy0-101Hjsp3khYnyMqn72pSWhRgAArfsjjdpHc1QTOfzvdzETljDn79H7xp75sMIEk_OaGRM4vuHQZy6cnO3PcL5laBD4TnDRTJ54u5iWjiPapSJhQlRD7XUVoPBTHcdFeb_PrpE5mY-NvwiFfXWujmb-RBK-MK5VzY4UlPCgqba4GYMgHnLTxtZ-8rl08sn6N86IaFrIgVf-Ho5Lz8MGWl4xbI6W7PGRZ6dRRs2tidjTfVq4AzSfQKNbgqezBcGm_0drAK_RSVPKTXcMCPDpJ4sv1oziPbsKZOzSdnlM7OCfhXVq8MunoBtS7IAQOAtaGyD8Wjyzoj2OLeFO06sdaXY92kfmc037Q7_8l9I3YKgKHow6YvWf57uMdJCTxEq_B-kezMfEsZA4Ekt7xUdzYF2VetpOcEMwUEN5yvvlbXESy2XicAMLPyWNzC7Q9CFi3T6ijVuG_xsZGjcMTXLeier37gn_xsW9VeMbS4THWC7F_c-rIrrr5Sf8AcvyHtwzqK1Zc2kdT3UFDQ2k5xGeNete6q7AOONeg53cWTb3Nt9LZUUuGOMcf7Hpofaj3TY5DBztI8WdROF4ZpvnlZiEkpU-7wJN5NSss6BzLG3-YwdENCugh3_pxTIRwjU8EP-925NKbYHJHqKXuNPwZq5Z1jTNYxlD48drSDs_sFr1P2Kgj_ISzarIjVtO4qUz5uYgvUM-dh2oPr27UOVQR8da95ndpCPMOSfXDLfmKTBd0mRqM7LkYw3C5mPFmP1A9ZlBPGKWbGpPvqmxwpUBhtbQzKWGPC7YYf2f_dKZh6cAT1DN1NCkQ3L8kCFaP5G7ku5tn00YxWrGLddD_hyaCh0SkexejbuNMq0NhRr-LPDcvQvRDyKDOCY9Qxm9_LTIQv3SlukhXwOI03_984qNv_XHHkpfg9JJ7u19dqga0lZg7H8NNle2MYyo8xbh0gLLhWKwdRix0JrKzKonIrK3ziD3UaV2zFsfrEI-dd8tHykIdD9qJl8tsRKzl4nbU4BYipRe9pbKDy9JionTxu5jFMaTIDBudh9Tqvc_fFSbq4C3LjxJkl0oFD7-7z-kWJRr72WECL-o2pRB6itASdM_WPXmXyJDyY6yFp03EBeD4BYf4HzOP5y8XFK15RYQq3XpKZ91Q-Pf8aRLbW5EXLzTMJjdbGmGrtvoFOP4Sa4LkhY9-W5fGrldyfOCc0OFnJVzOsfMeEq0O1rzN50wWTy-MH9VtIBRYCeStdP1S8HgBrkKq2JxMowX-6mwXxg2hLcGRzny1nMsa3aX8LIxJnGOUdaf1lMlV4TGg5C0DfzZHN-aC0PgNfCJGWqpmej8-_BZvhW8ZxMe255uDlA86ePfZ3hs05vyD3miOTZkfaSwqQ5riv7vFAmbUCuRd2IuPV3DEwnbW3PIHQilPrc90cdnk-SQOQ8iN4ci1yQouwLcgq1xfSK8CqwhFIbPuTrirzw-rVTLDGT7hqReCO4_MNKnvSggoz4MDEKblll90lt1oKQBqK5QMi_XpvZQOaDC3lHlSZV73fPuPwrtJXe09MwKJaa3EZ7NIf3j3ktn3LNO7a10qy7yUJYR3VkLn-2cq7jNibi-CZ8LrdqGTiCGrHGYEuFidJJLupDeRgMctLDdDT0wxomLL4_AKI1YrqxrMRZ0DoC7I4agyZqK1KdYAnOTkzGTwVkS_6n5Zfkkst3uUvFGKGBb5P9c_tGXmIQKhNp13u5Y',
        wpnonce: '03a8e8314d',
        instagram_url: text
    });

    try {
        const res = await axios.post('https://views4you.com/wp-admin/admin-ajax.php', inti);
        let data = res.data;
        if (!data.success) return m.reply('Gagal mendapatkan data.');
        //info-info
        let info = data.data.user_info;
        let hasil = `👤 *Username:* ${info.account_name}\n🔗 *Profile Link:* ${info.user_link}\n👥 *Followers:* ${info.user_counts}\n👤 *Following:* ${info.following_counts}\n📌 *Bio:* ${info.user_bio}\n📸 *Total Posts:* ${info.media_count}`;

        await conn.sendMessage(m.chat, {
            image: {
                url: info.user_image
            },
            caption: hasil
        }, {
            quoted: m
        });
    } catch (error) {
        console.error(error);
        await m.reply('error, busa jadi fiturnya atau user tidak ditemukan.');
    }
};

handler.help = ['igstalk username'];
handler.tags = ['stalker'];
handler.command = /^igs|igstalk|istalker$/i;
handler.limit = true
export default handler;