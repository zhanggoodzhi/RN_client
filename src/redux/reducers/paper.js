import * as constent from '../constent';
const initialState = {
    areaIndex: 0,
    questionIndex: 0,
    contentIndex: 0,
    listenGuide: false,// 是否正在听指导
    listenQustion: false,//小喇叭播放状态
    ifSection2: false, // 是否是听后记录与转述第二节
    audioPath: '/storage/emulated/0/RecordDemo/paper/',
    selectedPaper: null,
    paperAnswer: {
        recordguid: []
    },
    paperData: {
        "waitseconds": "0",
        "papertemplatename": "",
        "guid": "fb092a03688a41b0836bdb21f22bfe05",
        "image": "",
        "IsCustomPaper": "True",
        "speakingscore": "10",
        "times": "0",
        "content": "",
        "sections": "",
        "listeningscore": "3",
        "backgroudaudioseconds": "0",
        "title": "",
        "totalscore": "13",
        "totalexamtime": "315",
        "name": "张志pad练习测试",
        "backgroundaudio": "",
        "areas": [
            {
                "times": "1",
                "backgroundaudioseconds": "19",
                "presubmitmaxseconds": "0",
                "questions": [
                    {
                        "waitseconds": "0",
                        "image": "",
                        "tipsaudioseconds": "0",
                        "newscreen": "False",
                        "audiotext": "",
                        "presubmitmaxseconds": "0",
                        "index": "1",
                        "video": "",
                        "videoseconds": "0",
                        "title": "",
                        "answerseconds": "0",
                        "prepareseconds": "180",
                        "tips": "",
                        "audioseconds": "0",
                        "score": "3",
                        "times": "0",
                        "contents": [
                            {
                                recordResult: { "overall": 5, "integrity": 0, "fluency": 0, "pron": 0, "rhythm": 0, "details": [{ "text": "My name is Tom,", "score": 1, "start": 0, "end": 0, "words": [{ "text": "my", "score": 1, "start": 0, "end": 0 }, { "text": "name", "score": 1, "start": 0, "end": 0 }, { "text": "is", "score": 1, "start": 0, "end": 0 }, { "text": "tom", "score": 1, "start": 0, "end": 0 }] }, { "text": "and I'm fifteen.", "score": 1, "start": 0, "end": 0, "words": [{ "text": "and", "score": 1, "start": 0, "end": 0 }, { "text": "i'm", "score": 1, "start": 0, "end": 0 }, { "text": "fifteen", "score": 1, "start": 0, "end": 0 }] }, { "text": "I've been at River School since I was eleven.", "score": 1, "start": 0, "end": 0, "words": [{ "text": "i've", "score": 1, "start": 0, "end": 0 }, { "text": "been", "score": 1, "start": 0, "end": 0 }, { "text": "at", "score": 1, "start": 0, "end": 0 }, { "text": "river", "score": 1, "start": 0, "end": 0 }, { "text": "school", "score": 1, "start": 0, "end": 0 }, { "text": "since", "score": 1, "start": 0, "end": 0 }, { "text": "i", "score": 1, "start": 0, "end": 0 }, { "text": "was", "score": 1, "start": 0, "end": 0 }, { "text": "eleven", "score": 1, "start": 0, "end": 0 }] }, { "text": "If I pass my exams next year,", "score": 1, "start": 0, "end": 0, "words": [{ "text": "if", "score": 1, "start": 0, "end": 0 }, { "text": "i", "score": 1, "start": 0, "end": 0 }, { "text": "pass", "score": 1, "start": 0, "end": 0 }, { "text": "my", "score": 1, "start": 0, "end": 0 }, { "text": "exams", "score": 1, "start": 0, "end": 0 }, { "text": "next", "score": 1, "start": 0, "end": 0 }, { "text": "year", "score": 1, "start": 0, "end": 0 }] }, { "text": "I'll stay here until I'm eighteen.", "score": 1, "start": 0, "end": 0, "words": [{ "text": "i'll", "score": 1, "start": 0, "end": 0 }, { "text": "stay", "score": 1, "start": 0, "end": 0 }, { "text": "here", "score": 1, "start": 0, "end": 0 }, { "text": "until", "score": 1, "start": 0, "end": 0 }, { "text": "i'm", "score": 1, "start": 0, "end": 0 }, { "text": "eighteen", "score": 1, "start": 0, "end": 0 }] }, { "text": "River School is a secondary school,", "score": 1, "start": 0, "end": 0, "words": [{ "text": "river", "score": 1, "start": 0, "end": 0 }, { "text": "school", "score": 1, "start": 0, "end": 0 }, { "text": "is", "score": 1, "start": 0, "end": 0 }, { "text": "a", "score": 1, "start": 0, "end": 0 }, { "text": "secondary", "score": 1, "start": 0, "end": 0 }, { "text": "school", "score": 1, "start": 0, "end": 0 }] }, { "text": "about twenty minutes away from my home by bike.", "score": 1, "start": 0, "end": 0, "words": [{ "text": "about", "score": 1, "start": 0, "end": 0 }, { "text": "twenty", "score": 1, "start": 0, "end": 0 }, { "text": "minutes", "score": 1, "start": 0, "end": 0 }, { "text": "away", "score": 1, "start": 0, "end": 0 }, { "text": "from", "score": 1, "start": 0, "end": 0 }, { "text": "my", "score": 1, "start": 0, "end": 0 }, { "text": "home", "score": 1, "start": 0, "end": 0 }, { "text": "by", "score": 1, "start": 0, "end": 0 }, { "text": "bike", "score": 1, "start": 0, "end": 0 }] }, { "text": "We go to school every weekday from 8:45 a.m to 3:15 p.m. We have a large sports ground for football and tennis,", "score": 1, "start": 0, "end": 0, "words": [{ "text": "we", "score": 1, "start": 0, "end": 0 }, { "text": "go", "score": 1, "start": 0, "end": 0 }, { "text": "to", "score": 1, "start": 0, "end": 0 }, { "text": "school", "score": 1, "start": 0, "end": 0 }, { "text": "every", "score": 1, "start": 0, "end": 0 }, { "text": "weekday", "score": 1, "start": 0, "end": 0 }, { "text": "from", "score": 1, "start": 0, "end": 0 }, { "text": "8:45", "score": 1, "start": 0, "end": 0 }, { "text": "a.m", "score": 1, "start": 0, "end": 0 }, { "text": "to", "score": 1, "start": 0, "end": 0 }, { "text": "3:15", "score": 1, "start": 0, "end": 0 }, { "text": "p.m", "score": 1, "start": 0, "end": 0 }, { "text": "we", "score": 1, "start": 0, "end": 0 }, { "text": "have", "score": 1, "start": 0, "end": 0 }, { "text": "a", "score": 1, "start": 0, "end": 0 }, { "text": "large", "score": 1, "start": 0, "end": 0 }, { "text": "sports", "score": 1, "start": 0, "end": 0 }, { "text": "ground", "score": 1, "start": 0, "end": 0 }, { "text": "for", "score": 1, "start": 0, "end": 0 }, { "text": "football", "score": 1, "start": 0, "end": 0 }, { "text": "and", "score": 1, "start": 0, "end": 0 }, { "text": "tennis", "score": 1, "start": 0, "end": 0 }] }, { "text": "where we can play both during and after school hours.", "score": 1, "start": 0, "end": 0, "words": [{ "text": "where", "score": 1, "start": 0, "end": 0 }, { "text": "we", "score": 1, "start": 0, "end": 0 }, { "text": "can", "score": 1, "start": 0, "end": 0 }, { "text": "play", "score": 1, "start": 0, "end": 0 }, { "text": "both", "score": 1, "start": 0, "end": 0 }, { "text": "during", "score": 1, "start": 0, "end": 0 }, { "text": "and", "score": 1, "start": 0, "end": 0 }, { "text": "after", "score": 1, "start": 0, "end": 0 }, { "text": "school", "score": 1, "start": 0, "end": 0 }, { "text": "hours", "score": 1, "start": 0, "end": 0 }] }, { "text": "After-school activities,", "score": 1, "start": 0, "end": 0, "words": [{ "text": "after-school", "score": 1, "start": 0, "end": 0 }, { "text": "activities", "score": 1, "start": 0, "end": 0 }] }, { "text": "such as sports clubs and language societies,", "score": 1, "start": 0, "end": 0, "words": [{ "text": "such", "score": 1, "start": 0, "end": 0 }, { "text": "as", "score": 1, "start": 0, "end": 0 }, { "text": "sports", "score": 1, "start": 0, "end": 0 }, { "text": "clubs", "score": 1, "start": 0, "end": 0 }, { "text": "and", "score": 1, "start": 0, "end": 0 }, { "text": "language", "score": 1, "start": 0, "end": 0 }, { "text": "societies", "score": 1, "start": 0, "end": 0 }] }, { "text": "are popular too.", "score": 1, "start": 0, "end": 0, "words": [{ "text": "are", "score": 1, "start": 0, "end": 0 }, { "text": "popular", "score": 1, "start": 0, "end": 0 }, { "text": "too", "score": 1, "start": 0, "end": 0 }] }, { "text": "During the school year there are usually visits to museums and to camps for activities,", "score": 1, "start": 0, "end": 0, "words": [{ "text": "during", "score": 1, "start": 0, "end": 0 }, { "text": "the", "score": 1, "start": 0, "end": 0 }, { "text": "school", "score": 1, "start": 0, "end": 0 }, { "text": "year", "score": 1, "start": 0, "end": 0 }, { "text": "there", "score": 1, "start": 0, "end": 0 }, { "text": "are", "score": 1, "start": 0, "end": 0 }, { "text": "usually", "score": 1, "start": 0, "end": 0 }, { "text": "visits", "score": 1, "start": 0, "end": 0 }, { "text": "to", "score": 1, "start": 0, "end": 0 }, { "text": "museums", "score": 1, "start": 0, "end": 0 }, { "text": "and", "score": 1, "start": 0, "end": 0 }, { "text": "to", "score": 1, "start": 0, "end": 0 }, { "text": "camps", "score": 1, "start": 0, "end": 0 }, { "text": "for", "score": 1, "start": 0, "end": 0 }, { "text": "activities", "score": 1, "start": 0, "end": 0 }] }, { "text": "such as climbing and walking in the country.", "score": 1, "start": 0, "end": 0, "words": [{ "text": "such", "score": 1, "start": 0, "end": 0 }, { "text": "as", "score": 1, "start": 0, "end": 0 }, { "text": "climbing", "score": 1, "start": 0, "end": 0 }, { "text": "and", "score": 1, "start": 0, "end": 0 }, { "text": "walking", "score": 1, "start": 0, "end": 0 }, { "text": "in", "score": 1, "start": 0, "end": 0 }, { "text": "the", "score": 1, "start": 0, "end": 0 }, { "text": "country", "score": 1, "start": 0, "end": 0 }] }], "info": { "volume": 56, "clip": 0, "snr": -10, "tipId": 10004 }, "version": "1.1.2-2018.1.25.11:08:47", "res": "eng.pred.aux.P3.V4.12", "rank": 100, "precision": 1, "tips": "no voice detected", "pretime": 58, "systime": 866, "wavetime": 580, "delaytime": 18, "realtime": 141 },
                                "image": "20aa006ebedf4359a3efb5c8591ee215_Image.jpg",
                                "refrencetexts": {
                                    "refrencetext": {
                                        "index": "0",
                                        "guid": "f6f7fa8113074ddbab61275e8e949dcf",
                                        "content": "Hello, Mike. I heard that you would come to China for ten days. The best time to visit China is April and May. I suggest you go to Beijing to visit the Imperial Palace. Those days, the weather will be pretty well. It will be warmer and warmer. You can wear summer clothes and take some thin jackets with you. Look forward to your arrival."
                                    }
                                },
                                "audiotext": "Hello, Mike. I heard that you would come to China for ten days. The best time to visit China is April and May. I suggest you go to Beijing to visit the Imperial Palace. Those days, the weather will be pretty well. It will be warmer and warmer. You can wear summer clothes and take some thin jackets with you. Look forward to your arrival.",
                                "presubmitmaxseconds": "0",
                                "answers": {
                                    "answer": {
                                        "index": "0",
                                        "guid": "6d866eb88e87460eb82848017fc6af90",
                                        "audio": "",
                                        "content": "Hello, Mike. I heard that you would come to China for 10 days. The best time to visit China is April and May. I suggest you go to Beijing to visit the Imperial Palace. Those days, the weather will be pretty well. It will be warmer and warmer. You can wear summer clothes and take some thin jackets with you. Look forward to your arrival.",
                                        "audioseconds": "0"
                                    }
                                },
                                "index": "1",
                                "video": "",
                                "videoseconds": "0",
                                "answerseconds": "120",
                                "resourcetype": "1",
                                "prepareseconds": "180",
                                "tips": "",
                                "audioseconds": "0",
                                "layout": "1",
                                "score": [
                                    {
                                        "content": "3"
                                    },
                                    {
                                        "content": "3"
                                    }
                                ],
                                "times": "0",
                                "options": "",
                                "guid": "20aa006ebedf4359a3efb5c8591ee215",
                                "text": "请看下面的要点提示：\r\n你的英国朋友Mike决定来中国游玩10天，请根据以下问题给他一些建议：\r\nWhen is the best time to visit China?\r\nWhat are good places to see? (at least two)\r\nWhat might the weather be like?\r\nWhat advice would you like to give him? (clothes, useful things, transportation, food, interesting activities… … )\r\n",
                                "audio": "",
                                "tipsaudioSeconds": "0",
                                "tipsaudio": "",
                                "choosetype": "1"
                            }
                        ],
                        "guid": "b34ec7e080454103ab1f5a69a57d8ad7",
                        "promptaudio": "",
                        "text": "",
                        "audio": "",
                        "promptaudioseconds": "0",
                        "tipsaudio": "",
                        "prompt": ""
                    }
                ],
                "index": "4",
                "guid": "2786a52471d64a1bb188ac62106b0f14",
                "backgroundaudio": "area_9_audio.mp3",
                "promptaudio": "area_9_audio.mp3",
                "type": "9",
                "title": "四、看图说话",
                "promptaudioseconds": "0",
                "prompt": "你将看到一幅图片，请你对图片进行口头描述。你将有时间做准备，在听到”嘀”的提示音后，请在规定时间内完成口头描述"
            },
            {
                "times": "1",
                "backgroundaudioseconds": "17",
                "presubmitmaxseconds": "0",
                "questions": [
                    {
                        "waitseconds": "0",
                        "image": "",
                        "tipsaudioseconds": "0",
                        "newscreen": "False",
                        "audiotext": "",
                        "presubmitmaxseconds": "0",
                        "index": "1",
                        "video": "",
                        "videoseconds": "0",
                        "title": "",
                        "answerseconds": "0",
                        "prepareseconds": "10",
                        "tips": "",
                        "audioseconds": "0",
                        "score": "3",
                        "times": "2",
                        "contents": [
                            {
                                "image": "",
                                "refrencetexts": {
                                    "refrencetext": [
                                        {
                                            "index": "0",
                                            "guid": "5a28e3e0be24484aa68d66a2446c5253",
                                            "content": "Liu tao got number one in the running race."
                                        },
                                        {
                                            "index": "1",
                                            "guid": "613e96d4c2c24c0eb851c48204f43e15",
                                            "content": "He got Number one in the running race."
                                        },
                                        {
                                            "index": "2",
                                            "guid": "c67f619e5bdb4611956d1f25ca8c05f6",
                                            "content": "He got number one."
                                        }
                                    ]
                                },
                                "audiotext": "Question 1. Did Liu Tao get No.1or No.2 in the running race？",
                                "presubmitmaxseconds": "0",
                                "answers": {
                                    "answer": [
                                        {
                                            "index": "0",
                                            "guid": "09b9f16b60844bdbaef0071c4d68235e",
                                            "audio": "",
                                            "content": "Liu tao got number one in the running race.",
                                            "audioseconds": "0"
                                        },
                                        {
                                            "index": "1",
                                            "guid": "f71917f6b5d0457b8ce07c8b47eb587b",
                                            "audio": "",
                                            "content": "He got Number one in the running race.",
                                            "audioseconds": "0"
                                        },
                                        {
                                            "index": "2",
                                            "guid": "86922493e34146558024aacd8dd08d80",
                                            "audio": "",
                                            "content": "He got number one.",
                                            "audioseconds": "0"
                                        }
                                    ]
                                },
                                recordResult: { "overall": 0, "integrity": 0, "fluency": 0, "pron": 0, "rhythm": 0, "details": [{ "text": "My name is Tom,", "score": 1, "start": 0, "end": 0, "words": [{ "text": "my", "score": 1, "start": 0, "end": 0 }, { "text": "name", "score": 1, "start": 0, "end": 0 }, { "text": "is", "score": 1, "start": 0, "end": 0 }, { "text": "tom", "score": 1, "start": 0, "end": 0 }] }, { "text": "and I'm fifteen.", "score": 1, "start": 0, "end": 0, "words": [{ "text": "and", "score": 1, "start": 0, "end": 0 }, { "text": "i'm", "score": 1, "start": 0, "end": 0 }, { "text": "fifteen", "score": 1, "start": 0, "end": 0 }] }, { "text": "I've been at River School since I was eleven.", "score": 1, "start": 0, "end": 0, "words": [{ "text": "i've", "score": 1, "start": 0, "end": 0 }, { "text": "been", "score": 1, "start": 0, "end": 0 }, { "text": "at", "score": 1, "start": 0, "end": 0 }, { "text": "river", "score": 1, "start": 0, "end": 0 }, { "text": "school", "score": 1, "start": 0, "end": 0 }, { "text": "since", "score": 1, "start": 0, "end": 0 }, { "text": "i", "score": 1, "start": 0, "end": 0 }, { "text": "was", "score": 1, "start": 0, "end": 0 }, { "text": "eleven", "score": 1, "start": 0, "end": 0 }] }, { "text": "If I pass my exams next year,", "score": 1, "start": 0, "end": 0, "words": [{ "text": "if", "score": 1, "start": 0, "end": 0 }, { "text": "i", "score": 1, "start": 0, "end": 0 }, { "text": "pass", "score": 1, "start": 0, "end": 0 }, { "text": "my", "score": 1, "start": 0, "end": 0 }, { "text": "exams", "score": 1, "start": 0, "end": 0 }, { "text": "next", "score": 1, "start": 0, "end": 0 }, { "text": "year", "score": 1, "start": 0, "end": 0 }] }, { "text": "I'll stay here until I'm eighteen.", "score": 1, "start": 0, "end": 0, "words": [{ "text": "i'll", "score": 1, "start": 0, "end": 0 }, { "text": "stay", "score": 1, "start": 0, "end": 0 }, { "text": "here", "score": 1, "start": 0, "end": 0 }, { "text": "until", "score": 1, "start": 0, "end": 0 }, { "text": "i'm", "score": 1, "start": 0, "end": 0 }, { "text": "eighteen", "score": 1, "start": 0, "end": 0 }] }, { "text": "River School is a secondary school,", "score": 1, "start": 0, "end": 0, "words": [{ "text": "river", "score": 1, "start": 0, "end": 0 }, { "text": "school", "score": 1, "start": 0, "end": 0 }, { "text": "is", "score": 1, "start": 0, "end": 0 }, { "text": "a", "score": 1, "start": 0, "end": 0 }, { "text": "secondary", "score": 1, "start": 0, "end": 0 }, { "text": "school", "score": 1, "start": 0, "end": 0 }] }, { "text": "about twenty minutes away from my home by bike.", "score": 1, "start": 0, "end": 0, "words": [{ "text": "about", "score": 1, "start": 0, "end": 0 }, { "text": "twenty", "score": 1, "start": 0, "end": 0 }, { "text": "minutes", "score": 1, "start": 0, "end": 0 }, { "text": "away", "score": 1, "start": 0, "end": 0 }, { "text": "from", "score": 1, "start": 0, "end": 0 }, { "text": "my", "score": 1, "start": 0, "end": 0 }, { "text": "home", "score": 1, "start": 0, "end": 0 }, { "text": "by", "score": 1, "start": 0, "end": 0 }, { "text": "bike", "score": 1, "start": 0, "end": 0 }] }, { "text": "We go to school every weekday from 8:45 a.m to 3:15 p.m. We have a large sports ground for football and tennis,", "score": 1, "start": 0, "end": 0, "words": [{ "text": "we", "score": 1, "start": 0, "end": 0 }, { "text": "go", "score": 1, "start": 0, "end": 0 }, { "text": "to", "score": 1, "start": 0, "end": 0 }, { "text": "school", "score": 1, "start": 0, "end": 0 }, { "text": "every", "score": 1, "start": 0, "end": 0 }, { "text": "weekday", "score": 1, "start": 0, "end": 0 }, { "text": "from", "score": 1, "start": 0, "end": 0 }, { "text": "8:45", "score": 1, "start": 0, "end": 0 }, { "text": "a.m", "score": 1, "start": 0, "end": 0 }, { "text": "to", "score": 1, "start": 0, "end": 0 }, { "text": "3:15", "score": 1, "start": 0, "end": 0 }, { "text": "p.m", "score": 1, "start": 0, "end": 0 }, { "text": "we", "score": 1, "start": 0, "end": 0 }, { "text": "have", "score": 1, "start": 0, "end": 0 }, { "text": "a", "score": 1, "start": 0, "end": 0 }, { "text": "large", "score": 1, "start": 0, "end": 0 }, { "text": "sports", "score": 1, "start": 0, "end": 0 }, { "text": "ground", "score": 1, "start": 0, "end": 0 }, { "text": "for", "score": 1, "start": 0, "end": 0 }, { "text": "football", "score": 1, "start": 0, "end": 0 }, { "text": "and", "score": 1, "start": 0, "end": 0 }, { "text": "tennis", "score": 1, "start": 0, "end": 0 }] }, { "text": "where we can play both during and after school hours.", "score": 1, "start": 0, "end": 0, "words": [{ "text": "where", "score": 1, "start": 0, "end": 0 }, { "text": "we", "score": 1, "start": 0, "end": 0 }, { "text": "can", "score": 1, "start": 0, "end": 0 }, { "text": "play", "score": 1, "start": 0, "end": 0 }, { "text": "both", "score": 1, "start": 0, "end": 0 }, { "text": "during", "score": 1, "start": 0, "end": 0 }, { "text": "and", "score": 1, "start": 0, "end": 0 }, { "text": "after", "score": 1, "start": 0, "end": 0 }, { "text": "school", "score": 1, "start": 0, "end": 0 }, { "text": "hours", "score": 1, "start": 0, "end": 0 }] }, { "text": "After-school activities,", "score": 1, "start": 0, "end": 0, "words": [{ "text": "after-school", "score": 1, "start": 0, "end": 0 }, { "text": "activities", "score": 1, "start": 0, "end": 0 }] }, { "text": "such as sports clubs and language societies,", "score": 1, "start": 0, "end": 0, "words": [{ "text": "such", "score": 1, "start": 0, "end": 0 }, { "text": "as", "score": 1, "start": 0, "end": 0 }, { "text": "sports", "score": 1, "start": 0, "end": 0 }, { "text": "clubs", "score": 1, "start": 0, "end": 0 }, { "text": "and", "score": 1, "start": 0, "end": 0 }, { "text": "language", "score": 1, "start": 0, "end": 0 }, { "text": "societies", "score": 1, "start": 0, "end": 0 }] }, { "text": "are popular too.", "score": 1, "start": 0, "end": 0, "words": [{ "text": "are", "score": 1, "start": 0, "end": 0 }, { "text": "popular", "score": 1, "start": 0, "end": 0 }, { "text": "too", "score": 1, "start": 0, "end": 0 }] }, { "text": "During the school year there are usually visits to museums and to camps for activities,", "score": 1, "start": 0, "end": 0, "words": [{ "text": "during", "score": 1, "start": 0, "end": 0 }, { "text": "the", "score": 1, "start": 0, "end": 0 }, { "text": "school", "score": 1, "start": 0, "end": 0 }, { "text": "year", "score": 1, "start": 0, "end": 0 }, { "text": "there", "score": 1, "start": 0, "end": 0 }, { "text": "are", "score": 1, "start": 0, "end": 0 }, { "text": "usually", "score": 1, "start": 0, "end": 0 }, { "text": "visits", "score": 1, "start": 0, "end": 0 }, { "text": "to", "score": 1, "start": 0, "end": 0 }, { "text": "museums", "score": 1, "start": 0, "end": 0 }, { "text": "and", "score": 1, "start": 0, "end": 0 }, { "text": "to", "score": 1, "start": 0, "end": 0 }, { "text": "camps", "score": 1, "start": 0, "end": 0 }, { "text": "for", "score": 1, "start": 0, "end": 0 }, { "text": "activities", "score": 1, "start": 0, "end": 0 }] }, { "text": "such as climbing and walking in the country.", "score": 1, "start": 0, "end": 0, "words": [{ "text": "such", "score": 1, "start": 0, "end": 0 }, { "text": "as", "score": 1, "start": 0, "end": 0 }, { "text": "climbing", "score": 1, "start": 0, "end": 0 }, { "text": "and", "score": 1, "start": 0, "end": 0 }, { "text": "walking", "score": 1, "start": 0, "end": 0 }, { "text": "in", "score": 1, "start": 0, "end": 0 }, { "text": "the", "score": 1, "start": 0, "end": 0 }, { "text": "country", "score": 1, "start": 0, "end": 0 }] }], "info": { "volume": 56, "clip": 0, "snr": -10, "tipId": 10004 }, "version": "1.1.2-2018.1.25.11:08:47", "res": "eng.pred.aux.P3.V4.12", "rank": 100, "precision": 1, "tips": "no voice detected", "pretime": 58, "systime": 866, "wavetime": 580, "delaytime": 18, "realtime": 141 },
                                "index": "1",
                                "video": "",
                                "videoseconds": "0",
                                "answerseconds": "10",
                                "resourcetype": "1",
                                "prepareseconds": "10",
                                "tips": "",
                                "audioseconds": "0",
                                "layout": "1",
                                "score": [
                                    {
                                        "content": "1.5"
                                    },
                                    {
                                        "content": "1.5"
                                    }
                                ],
                                "times": "2",
                                "options": "",
                                "guid": "0457ef79ffab4add857ce4f5c5f4be00",
                                "text": "",
                                "audio": "0457ef79ffab4add857ce4f5c5f4be00_Audio.mp3",
                                "tipsaudioSeconds": "0",
                                "tipsaudio": "",
                                "choosetype": "1"
                            },
                            {
                                "image": "",
                                "refrencetexts": {
                                    "refrencetext": [
                                        {
                                            "index": "0",
                                            "guid": "0b9174771c7a4f4e8f69afdfbe15b1dd",
                                            "content": "Congratulations!"
                                        },
                                        {
                                            "index": "1",
                                            "guid": "e61066b1b4c946f298bba419b3977251",
                                            "content": "I congratulated him."
                                        },
                                        {
                                            "index": "2",
                                            "guid": "a96d692fa5c64e059ce19b38c2888487",
                                            "content": "I said congratulations to him."
                                        }
                                    ]
                                },
                                "audiotext": "Question 2. What did you say to him?",
                                "presubmitmaxseconds": "0",
                                "answers": {
                                    "answer": [
                                        {
                                            "index": "0",
                                            "guid": "a3bf32a8a2824a4a8452feac91113bc1",
                                            "audio": "",
                                            "content": "Congratulations!",
                                            "audioseconds": "0"
                                        },
                                        {
                                            "index": "1",
                                            "guid": "fd4e12d942a54179a6429251e6e42f18",
                                            "audio": "",
                                            "content": "I congratulated him.",
                                            "audioseconds": "0"
                                        },
                                        {
                                            "index": "2",
                                            "guid": "59891dd6e4df4ec785c3b1ac7a44bf33",
                                            "audio": "",
                                            "content": "I said congratulations to him.",
                                            "audioseconds": "0"
                                        }
                                    ]
                                },
                                "index": "2",
                                "video": "",
                                "videoseconds": "0",
                                "answerseconds": "10",
                                "resourcetype": "1",
                                "prepareseconds": "10",
                                "tips": "",
                                "audioseconds": "0",
                                "layout": "1",
                                "score": [
                                    {
                                        "content": "1.5"
                                    },
                                    {
                                        "content": "1.5"
                                    }
                                ],
                                "times": "2",
                                "options": "",
                                "guid": "d02fead41dce4405a9adaccc9e5bf31d",
                                "text": "",
                                "audio": "d02fead41dce4405a9adaccc9e5bf31d_Audio.mp3",
                                "tipsaudioSeconds": "0",
                                "tipsaudio": "",
                                "choosetype": "1"
                            }
                        ],
                        "guid": "755a584706e14ed0b5bd87646aa57078",
                        "promptaudio": "",
                        "text": "请看下面的情景提示：\r\n刘涛取得了赛跑第一的好成绩，你向他表示了祝贺。",
                        "audio": "",
                        "promptaudioseconds": "0",
                        "tipsaudio": "",
                        "prompt": ""
                    }
                ],
                "index": "3",
                "guid": "773fede2b1044c39877c9c7ca8d073b9",
                "backgroundaudio": "area_7_audio.mp3",
                "promptaudio": "area_7_audio.mp3",
                "type": "7",
                "title": "三、情景问答",
                "promptaudioseconds": "0",
                "prompt": "你有时间阅读屏幕上的情景提示，并作答题准备。在听到“嘀”的提示音后，请根据情景提示对所提的问题用英语进行回答"
            },
            {
                "prompt": "听独白并阅读后面几个小题，从题中所给的A、B、C三个选项中选出最佳选项。",
                "title": "二、听短文答题",
                "guid": "93db32c82ae14fe091e50b530b6400c8",
                "backgroundaudioseconds": "14",
                "times": "1",
                "index": "2",
                "promptaudioseconds": "0",
                "backgroundaudio": "area_2_1_audio.mp3",
                "promptaudio": "area_2_1_audio.mp3",
                "type": "2",
                "presubmitmaxseconds": "0",
                "questions": [
                    {
                        "tips": "",
                        "score": "3",
                        "waitseconds": "0",
                        "prompt": "",
                        "newscreen": "False",
                        "contents": [
                            {
                                "tips": "",
                                "score": [
                                    {
                                        "content": "1.5"
                                    },
                                    {
                                        "content": "1.5"
                                    }
                                ],
                                "resourcetype": "1",
                                "audio": "",
                                "guid": "fd44a130dc0a49beb24340aa28061d60",
                                "videoseconds": "0",
                                "image": "",
                                "video": "",
                                "options": {
                                    "option": [
                                        {
                                            "content": "Lucy，gfdgdf.fdfd.gfdg.,df.",
                                            "guid": "c8f175f55a574881bd64057784d26b00",
                                            "index": "1"
                                        },
                                        {
                                            "content": "Andy.Lucyfd.gfd.gdfg.dfg.dfg.dfglf",
                                            "guid": "2b0a031424534677a8f4c8698121513f",
                                            "index": "2"
                                        },
                                        {
                                            "content": "Bill.Lucy，gfdgdf.fdfd.gfdg.fdg.fdgfd.gfd.gfd.gdfg.dfg.dfg.dfglf",
                                            "guid": "5b822321da9e414992eb1d8b9a5c9e40",
                                            "index": "3"
                                        }
                                    ]
                                },
                                "times": "2",
                                "answerseconds": "5",
                                "refrencetexts": "",
                                "layout": "1",
                                "audioseconds": "0",
                                "choosetype": "1",
                                "tipsaudioSeconds": "0",
                                "tipsaudio": "",
                                "answers": {
                                    "answer": {
                                        "index": "0",
                                        "content": "5b822321da9e414992eb1d8b9a5c9e40",
                                        "audio": "",
                                        "guid": "45bf4caac6724bf18b67c5bb225fe7ed",
                                        "audioseconds": "0"
                                    }
                                },
                                "text": "Who is the tallest in Andy's class?",
                                "index": "1",
                                "audiotext": "",
                                "prepareseconds": "5",
                                "presubmitmaxseconds": "0"
                            },
                            {
                                "tips": "",
                                "score": [
                                    {
                                        "content": "1.5"
                                    },
                                    {
                                        "content": "1.5"
                                    }
                                ],
                                "resourcetype": "1",
                                "audio": "",
                                "guid": "9af018de44c347b78bf2c8e8f20e9bed",
                                "videoseconds": "0",
                                "image": "",
                                "video": "",
                                "options": {
                                    "option": [
                                        {
                                            "content": "Last Monday.",
                                            "guid": "a2da515b0c794ec9b4103af07ccf16e5",
                                            "index": "1"
                                        },
                                        {
                                            "content": "Last Thursday.",
                                            "guid": "fe91126ae01140fd866784d36ed85ae8",
                                            "index": "2"
                                        },
                                        {
                                            "content": "Last Tuesday. ",
                                            "guid": "f0ec150ae65f421e8d8534648113cb3b",
                                            "index": "3"
                                        }
                                    ]
                                },
                                "times": "2",
                                "answerseconds": "5",
                                "refrencetexts": "",
                                "layout": "1",
                                "audioseconds": "0",
                                "choosetype": "1",
                                "tipsaudioSeconds": "0",
                                "tipsaudio": "",
                                "answers": {
                                    "answer": {
                                        "index": "0",
                                        "content": "fe91126ae01140fd866784d36ed85ae8",
                                        "audio": "",
                                        "guid": "9e61ac974ad9451abcef191c195e7b31",
                                        "audioseconds": "0"
                                    }
                                },
                                "text": "When was the talent show?",
                                "index": "2",
                                "audiotext": "",
                                "prepareseconds": "5",
                                "presubmitmaxseconds": "0"
                            }
                        ],
                        "audio": "369321e2f59c44a6b98d85e9e7a4986b_Audio.mp3",
                        "guid": "369321e2f59c44a6b98d85e9e7a4986b",
                        "videoseconds": "0",
                        "image": "",
                        "video": "",
                        "tipsaudioseconds": "0",
                        "times": "2",
                        "promptaudioseconds": "0",
                        "answerseconds": "10",
                        "audioseconds": "0",
                        "title": "",
                        "tipsaudio": "",
                        "text": "",
                        "index": "1",
                        "audiotext": "W: Are you the tallest in your class, Andy? \r\nM: No, Bill is the tallest. But I dance better than Bill. \r\nW: Did you win a prize in the talent show last Thursday? \r\nM: Yes, Lucy. I danced with my brother. We won the prize for the funniest performers. \r\nW: That sounds interesting.",
                        "prepareseconds": "10",
                        "promptaudio": "",
                        "presubmitmaxseconds": "0"
                    },
                ]
            },
            {
                "type": "22",
                "title": "二、听对话或独白回答问题",
                "prompt": "在回答每小题前，你将在屏幕上看到一个提问，并听到一个对话。你有规定的准备时间，在听到“嘀”的提示音后，回答该问题。请在规定的时间内完成。",
                "promptaudio": "area_22_audio.mp3",
                "promptaudioseconds": "0",
                "index": "2",
                "guid": "a100a7bd3009431293cd0b345a3f82a1",
                "times": "1",
                "presubmitmaxseconds": "0",
                "backgroundaudio": "area_22_audio.mp3",
                "backgroundaudioseconds": "22",
                "BackgroundAudio": "area_22_audio.mp3",
                "questions": [{
                    "guid": "fa159e271fa34bf3a56f28660ea5e72c",
                    "prompt": "听第一段对话，回答两个问题。现在你有十秒钟的阅题时间。",
                    "promptaudio": "fa159e271fa34bf3a56f28660ea5e72c_PromptAudio.mp3",
                    "promptaudioseconds": "9",
                    "audio": "fa159e271fa34bf3a56f28660ea5e72c_Audio.mp3",
                    "audioseconds": "0",
                    "videoseconds": "0",
                    "times": "2",
                    "prepareseconds": "10",
                    "tipsaudioseconds": "0",
                    "index": "1",
                    "presubmitmaxseconds": "0",
                    "newscreen": "False",
                    "audiotext": "W: Hi, John. Where did you go on summer holiday?",
                    "answerseconds": "8",
                    "waitseconds": "0",
                    "score": "4",
                    "preparesecond": "10",
                    "contents": [
                        {
                            "guid": "f023e27c09524b1c8b3f1c2e4e03ea92",
                            "text": "When did John go to Shanghai?",
                            "audio": "f023e27c09524b1c8b3f1c2e4e03ea92_Audio.mp3",
                            "audioseconds": "0",
                            "videoseconds": "0",
                            "times": "1",
                            "prepareseconds": "10",
                            "answerseconds": "8",
                            "tipsaudioSeconds": "0",
                            "index": "1",
                            // recordResult: { "overall": 0, "integrity": 0, "fluency": 0, "pron": 0, "rhythm": 0, "details": [{ "text": "My name is Tom,", "score": 1, "start": 0, "end": 0, "words": [{ "text": "my", "score": 1, "start": 0, "end": 0 }, { "text": "name", "score": 1, "start": 0, "end": 0 }, { "text": "is", "score": 1, "start": 0, "end": 0 }, { "text": "tom", "score": 1, "start": 0, "end": 0 }] }, { "text": "and I'm fifteen.", "score": 1, "start": 0, "end": 0, "words": [{ "text": "and", "score": 1, "start": 0, "end": 0 }, { "text": "i'm", "score": 1, "start": 0, "end": 0 }, { "text": "fifteen", "score": 1, "start": 0, "end": 0 }] }, { "text": "I've been at River School since I was eleven.", "score": 1, "start": 0, "end": 0, "words": [{ "text": "i've", "score": 1, "start": 0, "end": 0 }, { "text": "been", "score": 1, "start": 0, "end": 0 }, { "text": "at", "score": 1, "start": 0, "end": 0 }, { "text": "river", "score": 1, "start": 0, "end": 0 }, { "text": "school", "score": 1, "start": 0, "end": 0 }, { "text": "since", "score": 1, "start": 0, "end": 0 }, { "text": "i", "score": 1, "start": 0, "end": 0 }, { "text": "was", "score": 1, "start": 0, "end": 0 }, { "text": "eleven", "score": 1, "start": 0, "end": 0 }] }, { "text": "If I pass my exams next year,", "score": 1, "start": 0, "end": 0, "words": [{ "text": "if", "score": 1, "start": 0, "end": 0 }, { "text": "i", "score": 1, "start": 0, "end": 0 }, { "text": "pass", "score": 1, "start": 0, "end": 0 }, { "text": "my", "score": 1, "start": 0, "end": 0 }, { "text": "exams", "score": 1, "start": 0, "end": 0 }, { "text": "next", "score": 1, "start": 0, "end": 0 }, { "text": "year", "score": 1, "start": 0, "end": 0 }] }, { "text": "I'll stay here until I'm eighteen.", "score": 1, "start": 0, "end": 0, "words": [{ "text": "i'll", "score": 1, "start": 0, "end": 0 }, { "text": "stay", "score": 1, "start": 0, "end": 0 }, { "text": "here", "score": 1, "start": 0, "end": 0 }, { "text": "until", "score": 1, "start": 0, "end": 0 }, { "text": "i'm", "score": 1, "start": 0, "end": 0 }, { "text": "eighteen", "score": 1, "start": 0, "end": 0 }] }, { "text": "River School is a secondary school,", "score": 1, "start": 0, "end": 0, "words": [{ "text": "river", "score": 1, "start": 0, "end": 0 }, { "text": "school", "score": 1, "start": 0, "end": 0 }, { "text": "is", "score": 1, "start": 0, "end": 0 }, { "text": "a", "score": 1, "start": 0, "end": 0 }, { "text": "secondary", "score": 1, "start": 0, "end": 0 }, { "text": "school", "score": 1, "start": 0, "end": 0 }] }, { "text": "about twenty minutes away from my home by bike.", "score": 1, "start": 0, "end": 0, "words": [{ "text": "about", "score": 1, "start": 0, "end": 0 }, { "text": "twenty", "score": 1, "start": 0, "end": 0 }, { "text": "minutes", "score": 1, "start": 0, "end": 0 }, { "text": "away", "score": 1, "start": 0, "end": 0 }, { "text": "from", "score": 1, "start": 0, "end": 0 }, { "text": "my", "score": 1, "start": 0, "end": 0 }, { "text": "home", "score": 1, "start": 0, "end": 0 }, { "text": "by", "score": 1, "start": 0, "end": 0 }, { "text": "bike", "score": 1, "start": 0, "end": 0 }] }, { "text": "We go to school every weekday from 8:45 a.m to 3:15 p.m. We have a large sports ground for football and tennis,", "score": 1, "start": 0, "end": 0, "words": [{ "text": "we", "score": 1, "start": 0, "end": 0 }, { "text": "go", "score": 1, "start": 0, "end": 0 }, { "text": "to", "score": 1, "start": 0, "end": 0 }, { "text": "school", "score": 1, "start": 0, "end": 0 }, { "text": "every", "score": 1, "start": 0, "end": 0 }, { "text": "weekday", "score": 1, "start": 0, "end": 0 }, { "text": "from", "score": 1, "start": 0, "end": 0 }, { "text": "8:45", "score": 1, "start": 0, "end": 0 }, { "text": "a.m", "score": 1, "start": 0, "end": 0 }, { "text": "to", "score": 1, "start": 0, "end": 0 }, { "text": "3:15", "score": 1, "start": 0, "end": 0 }, { "text": "p.m", "score": 1, "start": 0, "end": 0 }, { "text": "we", "score": 1, "start": 0, "end": 0 }, { "text": "have", "score": 1, "start": 0, "end": 0 }, { "text": "a", "score": 1, "start": 0, "end": 0 }, { "text": "large", "score": 1, "start": 0, "end": 0 }, { "text": "sports", "score": 1, "start": 0, "end": 0 }, { "text": "ground", "score": 1, "start": 0, "end": 0 }, { "text": "for", "score": 1, "start": 0, "end": 0 }, { "text": "football", "score": 1, "start": 0, "end": 0 }, { "text": "and", "score": 1, "start": 0, "end": 0 }, { "text": "tennis", "score": 1, "start": 0, "end": 0 }] }, { "text": "where we can play both during and after school hours.", "score": 1, "start": 0, "end": 0, "words": [{ "text": "where", "score": 1, "start": 0, "end": 0 }, { "text": "we", "score": 1, "start": 0, "end": 0 }, { "text": "can", "score": 1, "start": 0, "end": 0 }, { "text": "play", "score": 1, "start": 0, "end": 0 }, { "text": "both", "score": 1, "start": 0, "end": 0 }, { "text": "during", "score": 1, "start": 0, "end": 0 }, { "text": "and", "score": 1, "start": 0, "end": 0 }, { "text": "after", "score": 1, "start": 0, "end": 0 }, { "text": "school", "score": 1, "start": 0, "end": 0 }, { "text": "hours", "score": 1, "start": 0, "end": 0 }] }, { "text": "After-school activities,", "score": 1, "start": 0, "end": 0, "words": [{ "text": "after-school", "score": 1, "start": 0, "end": 0 }, { "text": "activities", "score": 1, "start": 0, "end": 0 }] }, { "text": "such as sports clubs and language societies,", "score": 1, "start": 0, "end": 0, "words": [{ "text": "such", "score": 1, "start": 0, "end": 0 }, { "text": "as", "score": 1, "start": 0, "end": 0 }, { "text": "sports", "score": 1, "start": 0, "end": 0 }, { "text": "clubs", "score": 1, "start": 0, "end": 0 }, { "text": "and", "score": 1, "start": 0, "end": 0 }, { "text": "language", "score": 1, "start": 0, "end": 0 }, { "text": "societies", "score": 1, "start": 0, "end": 0 }] }, { "text": "are popular too.", "score": 1, "start": 0, "end": 0, "words": [{ "text": "are", "score": 1, "start": 0, "end": 0 }, { "text": "popular", "score": 1, "start": 0, "end": 0 }, { "text": "too", "score": 1, "start": 0, "end": 0 }] }, { "text": "During the school year there are usually visits to museums and to camps for activities,", "score": 1, "start": 0, "end": 0, "words": [{ "text": "during", "score": 1, "start": 0, "end": 0 }, { "text": "the", "score": 1, "start": 0, "end": 0 }, { "text": "school", "score": 1, "start": 0, "end": 0 }, { "text": "year", "score": 1, "start": 0, "end": 0 }, { "text": "there", "score": 1, "start": 0, "end": 0 }, { "text": "are", "score": 1, "start": 0, "end": 0 }, { "text": "usually", "score": 1, "start": 0, "end": 0 }, { "text": "visits", "score": 1, "start": 0, "end": 0 }, { "text": "to", "score": 1, "start": 0, "end": 0 }, { "text": "museums", "score": 1, "start": 0, "end": 0 }, { "text": "and", "score": 1, "start": 0, "end": 0 }, { "text": "to", "score": 1, "start": 0, "end": 0 }, { "text": "camps", "score": 1, "start": 0, "end": 0 }, { "text": "for", "score": 1, "start": 0, "end": 0 }, { "text": "activities", "score": 1, "start": 0, "end": 0 }] }, { "text": "such as climbing and walking in the country.", "score": 1, "start": 0, "end": 0, "words": [{ "text": "such", "score": 1, "start": 0, "end": 0 }, { "text": "as", "score": 1, "start": 0, "end": 0 }, { "text": "climbing", "score": 1, "start": 0, "end": 0 }, { "text": "and", "score": 1, "start": 0, "end": 0 }, { "text": "walking", "score": 1, "start": 0, "end": 0 }, { "text": "in", "score": 1, "start": 0, "end": 0 }, { "text": "the", "score": 1, "start": 0, "end": 0 }, { "text": "country", "score": 1, "start": 0, "end": 0 }] }], "info": { "volume": 56, "clip": 0, "snr": -10, "tipId": 10004 }, "version": "1.1.2-2018.1.25.11:08:47", "res": "eng.pred.aux.P3.V4.12", "rank": 100, "precision": 1, "tips": "no voice detected", "pretime": 58, "systime": 866, "wavetime": 580, "delaytime": 18, "realtime": 141 },                            
                            "choosetype": "1",
                            "layout": "1",
                            "resourcetype": "1",
                            "score": "2",
                            "presubmitmaxseconds": "0",
                            "answersecond": "8",
                            "score": {
                                "content": "2"
                            },
                            "refrencetexts": {
                                "refrencetext": [
                                    {
                                        "index": "0",
                                        "content": "W: Hi, John. Where did you go on summer holiday?",
                                        "guid": "b8d5ac02-17ac-4c8b-8356-5e9fdc7b9d86"
                                    },
                                    {
                                        "index": "0",
                                        "guid": "76c446ca1ce846c5955138a5244a0f12",
                                        "content": "On summer holiday."
                                    },
                                    {
                                        "index": "1",
                                        "guid": "d190c94aa92248b4b9385e97abc3aa3b",
                                        "content": "John went to Shanghai on summer holiday."
                                    },
                                    {
                                        "index": "2",
                                        "guid": "5f48cccfbfaa414eb201a47d0527f73c",
                                        "content": "He went to Shanghai on summer holiday."
                                    }
                                ]
                            },
                            "answers": {
                                "answer": [
                                    {
                                        "index": "0",
                                        "guid": "a4cadaf3aabf4cd6b514c020718601d4",
                                        "content": "On summer holiday.",
                                        "audioseconds": "0"
                                    },
                                    {
                                        "index": "1",
                                        "guid": "8e06affc59614767916af992f0fc2d46",
                                        "content": "John went to Shanghai on summer holiday.",
                                        "audioseconds": "0"
                                    },
                                    {
                                        "index": "2",
                                        "guid": "b36153973ef84c81a61bbb0fc9a684a4",
                                        "content": "He went to Shanghai on summer holiday.",
                                        "audioseconds": "0"
                                    }
                                ]
                            }
                        },
                        {
                            "guid": "c8b43b833c5042bd87e1efc294633b1e",
                            "text": "Who did John go with?",
                            "audio": "c8b43b833c5042bd87e1efc294633b1e_Audio.mp3",
                            "audioseconds": "0",
                            "videoseconds": "0",
                            "times": "1",
                            "prepareseconds": "10",
                            "answerseconds": "8",
                            "tipsaudioSeconds": "0",
                            "index": "2",
                            // recordResult: { "overall": 0, "integrity": 0, "fluency": 0, "pron": 0, "rhythm": 0, "details": [{ "text": "My name is Tom,", "score": 1, "start": 0, "end": 0, "words": [{ "text": "my", "score": 1, "start": 0, "end": 0 }, { "text": "name", "score": 1, "start": 0, "end": 0 }, { "text": "is", "score": 1, "start": 0, "end": 0 }, { "text": "tom", "score": 1, "start": 0, "end": 0 }] }, { "text": "and I'm fifteen.", "score": 1, "start": 0, "end": 0, "words": [{ "text": "and", "score": 1, "start": 0, "end": 0 }, { "text": "i'm", "score": 1, "start": 0, "end": 0 }, { "text": "fifteen", "score": 1, "start": 0, "end": 0 }] }, { "text": "I've been at River School since I was eleven.", "score": 1, "start": 0, "end": 0, "words": [{ "text": "i've", "score": 1, "start": 0, "end": 0 }, { "text": "been", "score": 1, "start": 0, "end": 0 }, { "text": "at", "score": 1, "start": 0, "end": 0 }, { "text": "river", "score": 1, "start": 0, "end": 0 }, { "text": "school", "score": 1, "start": 0, "end": 0 }, { "text": "since", "score": 1, "start": 0, "end": 0 }, { "text": "i", "score": 1, "start": 0, "end": 0 }, { "text": "was", "score": 1, "start": 0, "end": 0 }, { "text": "eleven", "score": 1, "start": 0, "end": 0 }] }, { "text": "If I pass my exams next year,", "score": 1, "start": 0, "end": 0, "words": [{ "text": "if", "score": 1, "start": 0, "end": 0 }, { "text": "i", "score": 1, "start": 0, "end": 0 }, { "text": "pass", "score": 1, "start": 0, "end": 0 }, { "text": "my", "score": 1, "start": 0, "end": 0 }, { "text": "exams", "score": 1, "start": 0, "end": 0 }, { "text": "next", "score": 1, "start": 0, "end": 0 }, { "text": "year", "score": 1, "start": 0, "end": 0 }] }, { "text": "I'll stay here until I'm eighteen.", "score": 1, "start": 0, "end": 0, "words": [{ "text": "i'll", "score": 1, "start": 0, "end": 0 }, { "text": "stay", "score": 1, "start": 0, "end": 0 }, { "text": "here", "score": 1, "start": 0, "end": 0 }, { "text": "until", "score": 1, "start": 0, "end": 0 }, { "text": "i'm", "score": 1, "start": 0, "end": 0 }, { "text": "eighteen", "score": 1, "start": 0, "end": 0 }] }, { "text": "River School is a secondary school,", "score": 1, "start": 0, "end": 0, "words": [{ "text": "river", "score": 1, "start": 0, "end": 0 }, { "text": "school", "score": 1, "start": 0, "end": 0 }, { "text": "is", "score": 1, "start": 0, "end": 0 }, { "text": "a", "score": 1, "start": 0, "end": 0 }, { "text": "secondary", "score": 1, "start": 0, "end": 0 }, { "text": "school", "score": 1, "start": 0, "end": 0 }] }, { "text": "about twenty minutes away from my home by bike.", "score": 1, "start": 0, "end": 0, "words": [{ "text": "about", "score": 1, "start": 0, "end": 0 }, { "text": "twenty", "score": 1, "start": 0, "end": 0 }, { "text": "minutes", "score": 1, "start": 0, "end": 0 }, { "text": "away", "score": 1, "start": 0, "end": 0 }, { "text": "from", "score": 1, "start": 0, "end": 0 }, { "text": "my", "score": 1, "start": 0, "end": 0 }, { "text": "home", "score": 1, "start": 0, "end": 0 }, { "text": "by", "score": 1, "start": 0, "end": 0 }, { "text": "bike", "score": 1, "start": 0, "end": 0 }] }, { "text": "We go to school every weekday from 8:45 a.m to 3:15 p.m. We have a large sports ground for football and tennis,", "score": 1, "start": 0, "end": 0, "words": [{ "text": "we", "score": 1, "start": 0, "end": 0 }, { "text": "go", "score": 1, "start": 0, "end": 0 }, { "text": "to", "score": 1, "start": 0, "end": 0 }, { "text": "school", "score": 1, "start": 0, "end": 0 }, { "text": "every", "score": 1, "start": 0, "end": 0 }, { "text": "weekday", "score": 1, "start": 0, "end": 0 }, { "text": "from", "score": 1, "start": 0, "end": 0 }, { "text": "8:45", "score": 1, "start": 0, "end": 0 }, { "text": "a.m", "score": 1, "start": 0, "end": 0 }, { "text": "to", "score": 1, "start": 0, "end": 0 }, { "text": "3:15", "score": 1, "start": 0, "end": 0 }, { "text": "p.m", "score": 1, "start": 0, "end": 0 }, { "text": "we", "score": 1, "start": 0, "end": 0 }, { "text": "have", "score": 1, "start": 0, "end": 0 }, { "text": "a", "score": 1, "start": 0, "end": 0 }, { "text": "large", "score": 1, "start": 0, "end": 0 }, { "text": "sports", "score": 1, "start": 0, "end": 0 }, { "text": "ground", "score": 1, "start": 0, "end": 0 }, { "text": "for", "score": 1, "start": 0, "end": 0 }, { "text": "football", "score": 1, "start": 0, "end": 0 }, { "text": "and", "score": 1, "start": 0, "end": 0 }, { "text": "tennis", "score": 1, "start": 0, "end": 0 }] }, { "text": "where we can play both during and after school hours.", "score": 1, "start": 0, "end": 0, "words": [{ "text": "where", "score": 1, "start": 0, "end": 0 }, { "text": "we", "score": 1, "start": 0, "end": 0 }, { "text": "can", "score": 1, "start": 0, "end": 0 }, { "text": "play", "score": 1, "start": 0, "end": 0 }, { "text": "both", "score": 1, "start": 0, "end": 0 }, { "text": "during", "score": 1, "start": 0, "end": 0 }, { "text": "and", "score": 1, "start": 0, "end": 0 }, { "text": "after", "score": 1, "start": 0, "end": 0 }, { "text": "school", "score": 1, "start": 0, "end": 0 }, { "text": "hours", "score": 1, "start": 0, "end": 0 }] }, { "text": "After-school activities,", "score": 1, "start": 0, "end": 0, "words": [{ "text": "after-school", "score": 1, "start": 0, "end": 0 }, { "text": "activities", "score": 1, "start": 0, "end": 0 }] }, { "text": "such as sports clubs and language societies,", "score": 1, "start": 0, "end": 0, "words": [{ "text": "such", "score": 1, "start": 0, "end": 0 }, { "text": "as", "score": 1, "start": 0, "end": 0 }, { "text": "sports", "score": 1, "start": 0, "end": 0 }, { "text": "clubs", "score": 1, "start": 0, "end": 0 }, { "text": "and", "score": 1, "start": 0, "end": 0 }, { "text": "language", "score": 1, "start": 0, "end": 0 }, { "text": "societies", "score": 1, "start": 0, "end": 0 }] }, { "text": "are popular too.", "score": 1, "start": 0, "end": 0, "words": [{ "text": "are", "score": 1, "start": 0, "end": 0 }, { "text": "popular", "score": 1, "start": 0, "end": 0 }, { "text": "too", "score": 1, "start": 0, "end": 0 }] }, { "text": "During the school year there are usually visits to museums and to camps for activities,", "score": 1, "start": 0, "end": 0, "words": [{ "text": "during", "score": 1, "start": 0, "end": 0 }, { "text": "the", "score": 1, "start": 0, "end": 0 }, { "text": "school", "score": 1, "start": 0, "end": 0 }, { "text": "year", "score": 1, "start": 0, "end": 0 }, { "text": "there", "score": 1, "start": 0, "end": 0 }, { "text": "are", "score": 1, "start": 0, "end": 0 }, { "text": "usually", "score": 1, "start": 0, "end": 0 }, { "text": "visits", "score": 1, "start": 0, "end": 0 }, { "text": "to", "score": 1, "start": 0, "end": 0 }, { "text": "museums", "score": 1, "start": 0, "end": 0 }, { "text": "and", "score": 1, "start": 0, "end": 0 }, { "text": "to", "score": 1, "start": 0, "end": 0 }, { "text": "camps", "score": 1, "start": 0, "end": 0 }, { "text": "for", "score": 1, "start": 0, "end": 0 }, { "text": "activities", "score": 1, "start": 0, "end": 0 }] }, { "text": "such as climbing and walking in the country.", "score": 1, "start": 0, "end": 0, "words": [{ "text": "such", "score": 1, "start": 0, "end": 0 }, { "text": "as", "score": 1, "start": 0, "end": 0 }, { "text": "climbing", "score": 1, "start": 0, "end": 0 }, { "text": "and", "score": 1, "start": 0, "end": 0 }, { "text": "walking", "score": 1, "start": 0, "end": 0 }, { "text": "in", "score": 1, "start": 0, "end": 0 }, { "text": "the", "score": 1, "start": 0, "end": 0 }, { "text": "country", "score": 1, "start": 0, "end": 0 }] }], "info": { "volume": 56, "clip": 0, "snr": -10, "tipId": 10004 }, "version": "1.1.2-2018.1.25.11:08:47", "res": "eng.pred.aux.P3.V4.12", "rank": 100, "precision": 1, "tips": "no voice detected", "pretime": 58, "systime": 866, "wavetime": 580, "delaytime": 18, "realtime": 141 },                            
                            "choosetype": "1",
                            "layout": "1",
                            "resourcetype": "1",
                            "score": "2",
                            "presubmitmaxseconds": "0",
                            "answersecond": "8",
                            "score": {
                                "content": "2"
                            },
                            "refrencetexts": {
                                "refrencetext": [
                                    {
                                        "index": "0",
                                        "content": "W: Hi, John. Where did you go on summer holiday?",
                                        "guid": "b2ccff07-11e2-42e0-9e91-0e95e3769895"
                                    },
                                    {
                                        "index": "0",
                                        "guid": "ff9d07210ec144f4981fa0a6115710fe",
                                        "content": "Mike."
                                    },
                                    {
                                        "index": "1",
                                        "guid": "092fcc10fc854a209b47ec65a065d6b1",
                                        "content": "John went there with Mike."
                                    },
                                    {
                                        "index": "2",
                                        "guid": "23e337999be845d6a16eeb9f9c1f5edd",
                                        "content": "John went with Mike."
                                    }
                                ]
                            },
                            "answers": {
                                "answer": [
                                    {
                                        "index": "0",
                                        "guid": "6e7a1e50d9f74440a5ca7cba0e055653",
                                        "content": "Mike.",
                                        "audioseconds": "0"
                                    },
                                    {
                                        "index": "1",
                                        "guid": "3ab6afd7f8c04c278ca230d61ab9dc99",
                                        "content": "John went there with Mike.",
                                        "audioseconds": "0"
                                    },
                                    {
                                        "index": "2",
                                        "guid": "2bea0a45719041c8adecfd2521693473",
                                        "content": "John went with Mike.",
                                        "audioseconds": "0"
                                    }
                                ]
                            }
                        }
                    ]
                }
                ]
            },
            {
                "prompt": "听后记录并转述信息。",
                "title": "二、听后记录并转述信息",
                "guid": "6289aaf57bd843a7b4399c199fa0c887",
                "backgroundaudioseconds": "3",
                "times": "1",
                "index": "2",
                "promptaudioseconds": "0",
                "backgroundaudio": "area_25_audio.mp3",
                "promptaudio": "area_25_audio.mp3",
                "type": "25",
                "presubmitmaxseconds": "0",
                "questions": [
                    {
                        "tips": "第二节 请再听一遍短文，在50秒钟内完成转述。",
                        "score": "10",
                        "waitseconds": "0",
                        "prompt": "第一节 每小题仅填写一个词。录音播放前，你将有20秒钟的时间阅读试题，听完后你将有60秒钟的作答时间。这段短文你将听两遍。",
                        "newscreen": "False",
                        "contents": [
                            {
                                "tips": "",
                                "score": [
                                    {
                                        "content": "1"
                                    },
                                    {
                                        "content": "1"
                                    }
                                ],
                                currentAnswer: 'test',
                                "resourcetype": "0",
                                "audio": "",
                                "guid": "91c663bf44b04d3d954f67cf4d1a1641",
                                "videoseconds": "0",
                                "image": "",
                                "video": "",
                                "options": "",
                                "times": "2",
                                "answerseconds": "60",
                                "refrencetexts": "",
                                "layout": "1",
                                "audioseconds": "0",
                                "choosetype": "3",
                                "tipsaudioSeconds": "0",
                                "tipsaudio": "",
                                "answers": {
                                    "answer": {
                                        "index": "1",
                                        "content": "daughter ",
                                        "audio": "",
                                        "guid": "ed23442ee16a456a841b4a32ce4a48af",
                                        "audioseconds": "0"
                                    }
                                },
                                "text": "",
                                "index": "1",
                                "audiotext": "",
                                "prepareseconds": "20",
                                "presubmitmaxseconds": "0"
                            },
                            {
                                "tips": "",
                                "score": [
                                    {
                                        "content": "1"
                                    },
                                    {
                                        "content": "1"
                                    }
                                ],
                                "resourcetype": "0",
                                "audio": "",
                                "guid": "039c0578658c405087d51e6b97609d0d",
                                "videoseconds": "0",
                                "image": "",
                                "video": "",
                                "options": "",
                                "times": "2",
                                "answerseconds": "60",
                                "refrencetexts": "",
                                "layout": "1",
                                "audioseconds": "0",
                                "choosetype": "3",
                                "tipsaudioSeconds": "0",
                                "tipsaudio": "",
                                "answers": {
                                    "answer": [
                                        {
                                            "index": "1",
                                            "content": "son",
                                            "audio": "",
                                            "guid": "6cda019372244bdf8d2c2d4d324fe246",
                                            "audioseconds": "0"
                                        },
                                        {
                                            "index": "2",
                                            "content": "boy ",
                                            "audio": "",
                                            "guid": "08c8243f666742a683873ba6b07e5996",
                                            "audioseconds": "0"
                                        }
                                    ]
                                },
                                "text": "",
                                "index": "2",
                                "audiotext": "",
                                "prepareseconds": "20",
                                "presubmitmaxseconds": "0"
                            },
                            {
                                "tips": "",
                                "score": [
                                    {
                                        "content": "1"
                                    },
                                    {
                                        "content": "1"
                                    }
                                ],
                                "resourcetype": "0",
                                "audio": "",
                                "guid": "fc836001ab7f40388a1d3e3e639ea6ec",
                                "videoseconds": "0",
                                "image": "",
                                "video": "",
                                "options": "",
                                "times": "2",
                                "answerseconds": "60",
                                "refrencetexts": "",
                                "layout": "1",
                                "audioseconds": "0",
                                "choosetype": "3",
                                "tipsaudioSeconds": "0",
                                "tipsaudio": "",
                                "answers": {
                                    "answer": [
                                        {
                                            "index": "1",
                                            "content": "16",
                                            "audio": "",
                                            "guid": "b21c8625425446a4aee3bba0977be7af",
                                            "audioseconds": "0"
                                        },
                                        {
                                            "index": "2",
                                            "content": "sixteen ",
                                            "audio": "",
                                            "guid": "69c9adb3e7a6467faceec96761b346b9",
                                            "audioseconds": "0"
                                        }
                                    ]
                                },
                                "text": "",
                                "index": "3",
                                "audiotext": "",
                                "prepareseconds": "20",
                                "presubmitmaxseconds": "0"
                            },
                            {
                                "tips": "",
                                "score": [
                                    {
                                        "content": "1"
                                    },
                                    {
                                        "content": "1"
                                    }
                                ],
                                "resourcetype": "0",
                                "audio": "",
                                "guid": "6cc4a530efe1492b93d9334a11684283",
                                "videoseconds": "0",
                                "image": "",
                                "video": "",
                                "options": "",
                                "times": "2",
                                "answerseconds": "60",
                                "refrencetexts": "",
                                "layout": "1",
                                "audioseconds": "0",
                                "choosetype": "3",
                                "tipsaudioSeconds": "0",
                                "tipsaudio": "",
                                "answers": {
                                    "answer": {
                                        "index": "1",
                                        "content": "junior",
                                        "audio": "",
                                        "guid": "b621bdd44b904465917e649de5edad33",
                                        "audioseconds": "0"
                                    }
                                },
                                "text": "",
                                "index": "4",
                                "audiotext": "",
                                "prepareseconds": "20",
                                "presubmitmaxseconds": "0"
                            },
                            {
                                "tips": "",
                                "score": [
                                    {
                                        "content": "1"
                                    },
                                    {
                                        "content": "1"
                                    }
                                ],
                                "resourcetype": "0",
                                "audio": "",
                                "guid": "86d9314fdd5746d19218a56212c1411b",
                                "videoseconds": "0",
                                "image": "",
                                "video": "",
                                "options": "",
                                "times": "2",
                                "answerseconds": "60",
                                "refrencetexts": "",
                                "layout": "1",
                                "audioseconds": "0",
                                "choosetype": "3",
                                "tipsaudioSeconds": "0",
                                "tipsaudio": "",
                                "answers": {
                                    "answer": {
                                        "index": "1",
                                        "content": "sell ",
                                        "audio": "",
                                        "guid": "1c8f2e2849db40ed86be79be10778678",
                                        "audioseconds": "0"
                                    }
                                },
                                "text": "",
                                "index": "5",
                                "audiotext": "",
                                "prepareseconds": "20",
                                "presubmitmaxseconds": "0"
                            },
                            {
                                "tips": "Her children are growing up fast...",
                                "score": [
                                    {
                                        "content": "5"
                                    },
                                    {
                                        "content": "5"
                                    }
                                ],
                                "resourcetype": "0",
                                "audio": "",
                                recordResult: { "overall": 5, "integrity": 0, "fluency": 0, "pron": 0, "rhythm": 0, "details": [{ "text": "My name is Tom,", "score": 1, "start": 0, "end": 0, "words": [{ "text": "my", "score": 1, "start": 0, "end": 0 }, { "text": "name", "score": 1, "start": 0, "end": 0 }, { "text": "is", "score": 1, "start": 0, "end": 0 }, { "text": "tom", "score": 1, "start": 0, "end": 0 }] }, { "text": "and I'm fifteen.", "score": 1, "start": 0, "end": 0, "words": [{ "text": "and", "score": 1, "start": 0, "end": 0 }, { "text": "i'm", "score": 1, "start": 0, "end": 0 }, { "text": "fifteen", "score": 1, "start": 0, "end": 0 }] }, { "text": "I've been at River School since I was eleven.", "score": 1, "start": 0, "end": 0, "words": [{ "text": "i've", "score": 1, "start": 0, "end": 0 }, { "text": "been", "score": 1, "start": 0, "end": 0 }, { "text": "at", "score": 1, "start": 0, "end": 0 }, { "text": "river", "score": 1, "start": 0, "end": 0 }, { "text": "school", "score": 1, "start": 0, "end": 0 }, { "text": "since", "score": 1, "start": 0, "end": 0 }, { "text": "i", "score": 1, "start": 0, "end": 0 }, { "text": "was", "score": 1, "start": 0, "end": 0 }, { "text": "eleven", "score": 1, "start": 0, "end": 0 }] }, { "text": "If I pass my exams next year,", "score": 1, "start": 0, "end": 0, "words": [{ "text": "if", "score": 1, "start": 0, "end": 0 }, { "text": "i", "score": 1, "start": 0, "end": 0 }, { "text": "pass", "score": 1, "start": 0, "end": 0 }, { "text": "my", "score": 1, "start": 0, "end": 0 }, { "text": "exams", "score": 1, "start": 0, "end": 0 }, { "text": "next", "score": 1, "start": 0, "end": 0 }, { "text": "year", "score": 1, "start": 0, "end": 0 }] }, { "text": "I'll stay here until I'm eighteen.", "score": 1, "start": 0, "end": 0, "words": [{ "text": "i'll", "score": 1, "start": 0, "end": 0 }, { "text": "stay", "score": 1, "start": 0, "end": 0 }, { "text": "here", "score": 1, "start": 0, "end": 0 }, { "text": "until", "score": 1, "start": 0, "end": 0 }, { "text": "i'm", "score": 1, "start": 0, "end": 0 }, { "text": "eighteen", "score": 1, "start": 0, "end": 0 }] }, { "text": "River School is a secondary school,", "score": 1, "start": 0, "end": 0, "words": [{ "text": "river", "score": 1, "start": 0, "end": 0 }, { "text": "school", "score": 1, "start": 0, "end": 0 }, { "text": "is", "score": 1, "start": 0, "end": 0 }, { "text": "a", "score": 1, "start": 0, "end": 0 }, { "text": "secondary", "score": 1, "start": 0, "end": 0 }, { "text": "school", "score": 1, "start": 0, "end": 0 }] }, { "text": "about twenty minutes away from my home by bike.", "score": 1, "start": 0, "end": 0, "words": [{ "text": "about", "score": 1, "start": 0, "end": 0 }, { "text": "twenty", "score": 1, "start": 0, "end": 0 }, { "text": "minutes", "score": 1, "start": 0, "end": 0 }, { "text": "away", "score": 1, "start": 0, "end": 0 }, { "text": "from", "score": 1, "start": 0, "end": 0 }, { "text": "my", "score": 1, "start": 0, "end": 0 }, { "text": "home", "score": 1, "start": 0, "end": 0 }, { "text": "by", "score": 1, "start": 0, "end": 0 }, { "text": "bike", "score": 1, "start": 0, "end": 0 }] }, { "text": "We go to school every weekday from 8:45 a.m to 3:15 p.m. We have a large sports ground for football and tennis,", "score": 1, "start": 0, "end": 0, "words": [{ "text": "we", "score": 1, "start": 0, "end": 0 }, { "text": "go", "score": 1, "start": 0, "end": 0 }, { "text": "to", "score": 1, "start": 0, "end": 0 }, { "text": "school", "score": 1, "start": 0, "end": 0 }, { "text": "every", "score": 1, "start": 0, "end": 0 }, { "text": "weekday", "score": 1, "start": 0, "end": 0 }, { "text": "from", "score": 1, "start": 0, "end": 0 }, { "text": "8:45", "score": 1, "start": 0, "end": 0 }, { "text": "a.m", "score": 1, "start": 0, "end": 0 }, { "text": "to", "score": 1, "start": 0, "end": 0 }, { "text": "3:15", "score": 1, "start": 0, "end": 0 }, { "text": "p.m", "score": 1, "start": 0, "end": 0 }, { "text": "we", "score": 1, "start": 0, "end": 0 }, { "text": "have", "score": 1, "start": 0, "end": 0 }, { "text": "a", "score": 1, "start": 0, "end": 0 }, { "text": "large", "score": 1, "start": 0, "end": 0 }, { "text": "sports", "score": 1, "start": 0, "end": 0 }, { "text": "ground", "score": 1, "start": 0, "end": 0 }, { "text": "for", "score": 1, "start": 0, "end": 0 }, { "text": "football", "score": 1, "start": 0, "end": 0 }, { "text": "and", "score": 1, "start": 0, "end": 0 }, { "text": "tennis", "score": 1, "start": 0, "end": 0 }] }, { "text": "where we can play both during and after school hours.", "score": 1, "start": 0, "end": 0, "words": [{ "text": "where", "score": 1, "start": 0, "end": 0 }, { "text": "we", "score": 1, "start": 0, "end": 0 }, { "text": "can", "score": 1, "start": 0, "end": 0 }, { "text": "play", "score": 1, "start": 0, "end": 0 }, { "text": "both", "score": 1, "start": 0, "end": 0 }, { "text": "during", "score": 1, "start": 0, "end": 0 }, { "text": "and", "score": 1, "start": 0, "end": 0 }, { "text": "after", "score": 1, "start": 0, "end": 0 }, { "text": "school", "score": 1, "start": 0, "end": 0 }, { "text": "hours", "score": 1, "start": 0, "end": 0 }] }, { "text": "After-school activities,", "score": 1, "start": 0, "end": 0, "words": [{ "text": "after-school", "score": 1, "start": 0, "end": 0 }, { "text": "activities", "score": 1, "start": 0, "end": 0 }] }, { "text": "such as sports clubs and language societies,", "score": 1, "start": 0, "end": 0, "words": [{ "text": "such", "score": 1, "start": 0, "end": 0 }, { "text": "as", "score": 1, "start": 0, "end": 0 }, { "text": "sports", "score": 1, "start": 0, "end": 0 }, { "text": "clubs", "score": 1, "start": 0, "end": 0 }, { "text": "and", "score": 1, "start": 0, "end": 0 }, { "text": "language", "score": 1, "start": 0, "end": 0 }, { "text": "societies", "score": 1, "start": 0, "end": 0 }] }, { "text": "are popular too.", "score": 1, "start": 0, "end": 0, "words": [{ "text": "are", "score": 1, "start": 0, "end": 0 }, { "text": "popular", "score": 1, "start": 0, "end": 0 }, { "text": "too", "score": 1, "start": 0, "end": 0 }] }, { "text": "During the school year there are usually visits to museums and to camps for activities,", "score": 1, "start": 0, "end": 0, "words": [{ "text": "during", "score": 1, "start": 0, "end": 0 }, { "text": "the", "score": 1, "start": 0, "end": 0 }, { "text": "school", "score": 1, "start": 0, "end": 0 }, { "text": "year", "score": 1, "start": 0, "end": 0 }, { "text": "there", "score": 1, "start": 0, "end": 0 }, { "text": "are", "score": 1, "start": 0, "end": 0 }, { "text": "usually", "score": 1, "start": 0, "end": 0 }, { "text": "visits", "score": 1, "start": 0, "end": 0 }, { "text": "to", "score": 1, "start": 0, "end": 0 }, { "text": "museums", "score": 1, "start": 0, "end": 0 }, { "text": "and", "score": 1, "start": 0, "end": 0 }, { "text": "to", "score": 1, "start": 0, "end": 0 }, { "text": "camps", "score": 1, "start": 0, "end": 0 }, { "text": "for", "score": 1, "start": 0, "end": 0 }, { "text": "activities", "score": 1, "start": 0, "end": 0 }] }, { "text": "such as climbing and walking in the country.", "score": 1, "start": 0, "end": 0, "words": [{ "text": "such", "score": 1, "start": 0, "end": 0 }, { "text": "as", "score": 1, "start": 0, "end": 0 }, { "text": "climbing", "score": 1, "start": 0, "end": 0 }, { "text": "and", "score": 1, "start": 0, "end": 0 }, { "text": "walking", "score": 1, "start": 0, "end": 0 }, { "text": "in", "score": 1, "start": 0, "end": 0 }, { "text": "the", "score": 1, "start": 0, "end": 0 }, { "text": "country", "score": 1, "start": 0, "end": 0 }] }], "info": { "volume": 56, "clip": 0, "snr": -10, "tipId": 10004 }, "version": "1.1.2-2018.1.25.11:08:47", "res": "eng.pred.aux.P3.V4.12", "rank": 100, "precision": 1, "tips": "no voice detected", "pretime": 58, "systime": 866, "wavetime": 580, "delaytime": 18, "realtime": 141 },
                                "guid": "a7d43acbc15e460ea0ed45ec79130016",
                                "videoseconds": "0",
                                "image": "",
                                "video": "",
                                "options": "",
                                "times": "1",
                                "answerseconds": "50",
                                "refrencetexts": {
                                    "refrencetext": [
                                        {
                                            "content": "Her children are growing up fast. Her daughter is sixteen years old and her boy is already in junior high school. As they get older, their house seems to be smaller. So they want to sell some of their things in a yard and give the money to transform a children's home. ",
                                            "guid": "6a42b8b795ed4a7eb58bc0529e3c7c13",
                                            "index": "1"
                                        },
                                        {
                                            "content": "Her children are growing up fast. Her daughter is sixteen years old and her son is already in junior high school. As they get older, their house seems to be smaller. So they want to sell some of their things in a yard and give the money to have a children's home. ",
                                            "guid": "e1091086b76641678bc6f62eced41b59",
                                            "index": "2"
                                        },
                                        {
                                            "content": "Her children are growing up fast. Her daughter is sixteen years old and her son is already in junior high school. As they get older, their house seems to be smaller. So they want to sell some of their things in a yard and give the money to a children's home. ",
                                            "guid": "8d6a0622e773440bbbcc7408f050989c",
                                            "index": "3"
                                        }
                                    ]
                                },
                                "layout": "0",
                                "audioseconds": "0",
                                "choosetype": "0",
                                "tipsaudioSeconds": "0",
                                "tipsaudio": "",
                                "answers": {
                                    "answer": [
                                        {
                                            "index": "1",
                                            "content": "Her children are growing up fast. Her daughter is sixteen years old and her boy is already in junior high school. As they get older, their house seems to be smaller. So they want to sell some of their things in a yard and give the money to transform a children's home. ",
                                            "audio": "",
                                            "guid": "7bec19bd86714e849eed8351ea9516da",
                                            "audioseconds": "0"
                                        },
                                        {
                                            "index": "2",
                                            "content": "Her children are growing up fast. Her daughter is sixteen years old and her son is already in junior high school. As they get older, their house seems to be smaller. So they want to sell some of their things in a yard and give the money to have a children's home. ",
                                            "audio": "",
                                            "guid": "0215062562c7482f9aab511ceb4f4d37",
                                            "audioseconds": "0"
                                        },
                                        {
                                            "index": "3",
                                            "content": "Her children are growing up fast. Her daughter is sixteen years old and her son is already in junior high school. As they get older, their house seems to be smaller. So they want to sell some of their things in a yard and give the money to a children's home. ",
                                            "audio": "",
                                            "guid": "644237d08e974756b13dc3dca07c21a3",
                                            "audioseconds": "0"
                                        }
                                    ]
                                },
                                "text": "",
                                "index": "6",
                                "audiotext": "",
                                "prepareseconds": "15",
                                "presubmitmaxseconds": "0"
                            }
                        ],
                        "audio": "040a1e5ad84b4ec79c3ae101d47acffb_Audio.mp3",
                        "guid": "040a1e5ad84b4ec79c3ae101d47acffb",
                        "videoseconds": "25",
                        "image": "040a1e5ad84b4ec79c3ae101d47acffb_Image.jpg",
                        "video": "",
                        "tipsaudioseconds": "4",
                        "times": "0",
                        "promptaudioseconds": "16",
                        "answerseconds": "0",
                        "audioseconds": "25",
                        "title": "",
                        "tipsaudio": "040a1e5ad84b4ec79c3ae101d47acffb_TipsAudio.mp3",
                        "text": "",
                        "index": "1",
                        "audiotext": "My children are growing up fast. My daughter is 16 and my boy is already in junior high school. As they get bigger, our house seems to get smaller. So we want to sell some of our things in a yard sale and give the money to a children's home.",
                        "prepareseconds": "0",
                        "promptaudio": "040a1e5ad84b4ec79c3ae101d47acffb_PromptAudio.mp3",
                        "presubmitmaxseconds": "0"
                    }
                ]
            },
            {
                "prompt": "请以适当音量、语调、停顿、语音朗读以下课文，你将有时间熟悉屏幕上的课文，并作答题准备。在听到“嘀”的提示音后，请将屏幕上的课文朗读一遍。",
                "title": "一、朗读短文",
                "guid": "ea38d0b72c7f47299bfb9387833d0b5b",
                "backgroundaudioseconds": "21",
                "times": "1",
                "index": "1",
                "promptaudioseconds": "0",
                "backgroundaudio": "area_3_audio.mp3",
                "promptaudio": "area_3_audio.mp3",
                "type": "3",
                "presubmitmaxseconds": "0",
                "questions": [
                    {
                        "tips": "",
                        "score": "10",
                        "waitseconds": "0",
                        "prompt": "",
                        "newscreen": "False",
                        "contents": [
                            {
                                "tips": "",
                                "score": [
                                    {
                                        "content": "10"
                                    },
                                    {
                                        "content": "10"
                                    }
                                ],
                                recordResult: { "overall": 5, "integrity": 5, "fluency": 5, "pron": 5, "rhythm": 5, "details": [{ "text": "My name is Tom,", "score": 1, "start": 0, "end": 0, "words": [{ "text": "my", "score": 1, "start": 0, "end": 0 }, { "text": "name", "score": 1, "start": 0, "end": 0 }, { "text": "is", "score": 1, "start": 0, "end": 0 }, { "text": "tom", "score": 1, "start": 0, "end": 0 }] }, { "text": "and I'm fifteen.", "score": 1, "start": 0, "end": 0, "words": [{ "text": "and", "score": 1, "start": 0, "end": 0 }, { "text": "i'm", "score": 1, "start": 0, "end": 0 }, { "text": "fifteen", "score": 1, "start": 0, "end": 0 }] }, { "text": "I've been at River School since I was eleven.", "score": 1, "start": 0, "end": 0, "words": [{ "text": "i've", "score": 1, "start": 0, "end": 0 }, { "text": "been", "score": 1, "start": 0, "end": 0 }, { "text": "at", "score": 1, "start": 0, "end": 0 }, { "text": "river", "score": 1, "start": 0, "end": 0 }, { "text": "school", "score": 1, "start": 0, "end": 0 }, { "text": "since", "score": 1, "start": 0, "end": 0 }, { "text": "i", "score": 1, "start": 0, "end": 0 }, { "text": "was", "score": 1, "start": 0, "end": 0 }, { "text": "eleven", "score": 1, "start": 0, "end": 0 }] }, { "text": "If I pass my exams next year,", "score": 1, "start": 0, "end": 0, "words": [{ "text": "if", "score": 1, "start": 0, "end": 0 }, { "text": "i", "score": 1, "start": 0, "end": 0 }, { "text": "pass", "score": 1, "start": 0, "end": 0 }, { "text": "my", "score": 1, "start": 0, "end": 0 }, { "text": "exams", "score": 1, "start": 0, "end": 0 }, { "text": "next", "score": 1, "start": 0, "end": 0 }, { "text": "year", "score": 1, "start": 0, "end": 0 }] }, { "text": "I'll stay here until I'm eighteen.", "score": 1, "start": 0, "end": 0, "words": [{ "text": "i'll", "score": 1, "start": 0, "end": 0 }, { "text": "stay", "score": 1, "start": 0, "end": 0 }, { "text": "here", "score": 1, "start": 0, "end": 0 }, { "text": "until", "score": 1, "start": 0, "end": 0 }, { "text": "i'm", "score": 1, "start": 0, "end": 0 }, { "text": "eighteen", "score": 1, "start": 0, "end": 0 }] }, { "text": "River School is a secondary school,", "score": 1, "start": 0, "end": 0, "words": [{ "text": "river", "score": 1, "start": 0, "end": 0 }, { "text": "school", "score": 1, "start": 0, "end": 0 }, { "text": "is", "score": 1, "start": 0, "end": 0 }, { "text": "a", "score": 1, "start": 0, "end": 0 }, { "text": "secondary", "score": 1, "start": 0, "end": 0 }, { "text": "school", "score": 1, "start": 0, "end": 0 }] }, { "text": "about twenty minutes away from my home by bike.", "score": 1, "start": 0, "end": 0, "words": [{ "text": "about", "score": 1, "start": 0, "end": 0 }, { "text": "twenty", "score": 1, "start": 0, "end": 0 }, { "text": "minutes", "score": 1, "start": 0, "end": 0 }, { "text": "away", "score": 1, "start": 0, "end": 0 }, { "text": "from", "score": 1, "start": 0, "end": 0 }, { "text": "my", "score": 1, "start": 0, "end": 0 }, { "text": "home", "score": 1, "start": 0, "end": 0 }, { "text": "by", "score": 1, "start": 0, "end": 0 }, { "text": "bike", "score": 1, "start": 0, "end": 0 }] }, { "text": "We go to school every weekday from 8:45 a.m to 3:15 p.m. We have a large sports ground for football and tennis,", "score": 1, "start": 0, "end": 0, "words": [{ "text": "we", "score": 1, "start": 0, "end": 0 }, { "text": "go", "score": 1, "start": 0, "end": 0 }, { "text": "to", "score": 1, "start": 0, "end": 0 }, { "text": "school", "score": 1, "start": 0, "end": 0 }, { "text": "every", "score": 1, "start": 0, "end": 0 }, { "text": "weekday", "score": 1, "start": 0, "end": 0 }, { "text": "from", "score": 1, "start": 0, "end": 0 }, { "text": "8:45", "score": 1, "start": 0, "end": 0 }, { "text": "a.m", "score": 1, "start": 0, "end": 0 }, { "text": "to", "score": 1, "start": 0, "end": 0 }, { "text": "3:15", "score": 1, "start": 0, "end": 0 }, { "text": "p.m", "score": 1, "start": 0, "end": 0 }, { "text": "we", "score": 1, "start": 0, "end": 0 }, { "text": "have", "score": 1, "start": 0, "end": 0 }, { "text": "a", "score": 1, "start": 0, "end": 0 }, { "text": "large", "score": 1, "start": 0, "end": 0 }, { "text": "sports", "score": 1, "start": 0, "end": 0 }, { "text": "ground", "score": 1, "start": 0, "end": 0 }, { "text": "for", "score": 1, "start": 0, "end": 0 }, { "text": "football", "score": 1, "start": 0, "end": 0 }, { "text": "and", "score": 1, "start": 0, "end": 0 }, { "text": "tennis", "score": 1, "start": 0, "end": 0 }] }, { "text": "where we can play both during and after school hours.", "score": 1, "start": 0, "end": 0, "words": [{ "text": "where", "score": 1, "start": 0, "end": 0 }, { "text": "we", "score": 1, "start": 0, "end": 0 }, { "text": "can", "score": 1, "start": 0, "end": 0 }, { "text": "play", "score": 1, "start": 0, "end": 0 }, { "text": "both", "score": 1, "start": 0, "end": 0 }, { "text": "during", "score": 1, "start": 0, "end": 0 }, { "text": "and", "score": 1, "start": 0, "end": 0 }, { "text": "after", "score": 1, "start": 0, "end": 0 }, { "text": "school", "score": 1, "start": 0, "end": 0 }, { "text": "hours", "score": 1, "start": 0, "end": 0 }] }, { "text": "After-school activities,", "score": 1, "start": 0, "end": 0, "words": [{ "text": "after-school", "score": 1, "start": 0, "end": 0 }, { "text": "activities", "score": 1, "start": 0, "end": 0 }] }, { "text": "such as sports clubs and language societies,", "score": 1, "start": 0, "end": 0, "words": [{ "text": "such", "score": 1, "start": 0, "end": 0 }, { "text": "as", "score": 1, "start": 0, "end": 0 }, { "text": "sports", "score": 1, "start": 0, "end": 0 }, { "text": "clubs", "score": 1, "start": 0, "end": 0 }, { "text": "and", "score": 1, "start": 0, "end": 0 }, { "text": "language", "score": 1, "start": 0, "end": 0 }, { "text": "societies", "score": 1, "start": 0, "end": 0 }] }, { "text": "are popular too.", "score": 1, "start": 0, "end": 0, "words": [{ "text": "are", "score": 1, "start": 0, "end": 0 }, { "text": "popular", "score": 1, "start": 0, "end": 0 }, { "text": "too", "score": 1, "start": 0, "end": 0 }] }, { "text": "During the school year there are usually visits to museums and to camps for activities,", "score": 1, "start": 0, "end": 0, "words": [{ "text": "during", "score": 1, "start": 0, "end": 0 }, { "text": "the", "score": 1, "start": 0, "end": 0 }, { "text": "school", "score": 1, "start": 0, "end": 0 }, { "text": "year", "score": 1, "start": 0, "end": 0 }, { "text": "there", "score": 1, "start": 0, "end": 0 }, { "text": "are", "score": 1, "start": 0, "end": 0 }, { "text": "usually", "score": 1, "start": 0, "end": 0 }, { "text": "visits", "score": 1, "start": 0, "end": 0 }, { "text": "to", "score": 1, "start": 0, "end": 0 }, { "text": "museums", "score": 1, "start": 0, "end": 0 }, { "text": "and", "score": 1, "start": 0, "end": 0 }, { "text": "to", "score": 1, "start": 0, "end": 0 }, { "text": "camps", "score": 1, "start": 0, "end": 0 }, { "text": "for", "score": 1, "start": 0, "end": 0 }, { "text": "activities", "score": 1, "start": 0, "end": 0 }] }, { "text": "such as climbing and walking in the country.", "score": 1, "start": 0, "end": 0, "words": [{ "text": "such", "score": 1, "start": 0, "end": 0 }, { "text": "as", "score": 1, "start": 0, "end": 0 }, { "text": "climbing", "score": 1, "start": 0, "end": 0 }, { "text": "and", "score": 1, "start": 0, "end": 0 }, { "text": "walking", "score": 1, "start": 0, "end": 0 }, { "text": "in", "score": 1, "start": 0, "end": 0 }, { "text": "the", "score": 1, "start": 0, "end": 0 }, { "text": "country", "score": 1, "start": 0, "end": 0 }] }], "info": { "volume": 56, "clip": 0, "snr": -10, "tipId": 10004 }, "version": "1.1.2-2018.1.25.11:08:47", "res": "eng.pred.aux.P3.V4.12", "rank": 100, "precision": 1, "tips": "no voice detected", "pretime": 58, "systime": 866, "wavetime": 580, "delaytime": 18, "realtime": 141 },
                                "resourcetype": "1",
                                "audio": "aaa2c71c844746e980bf062b947e5252_Audio.mp3",
                                "guid": "aaa2c71c844746e980bf062b947e5252",
                                "videoseconds": "54",
                                "image": "",
                                "video": "",
                                "options": "",
                                "times": "0",
                                "answerseconds": "60",
                                "refrencetexts": {
                                    "refrencetext": {
                                        "content": "My name is Tom, and I'm fifteen. I've been at River School since I was eleven. If I pass my exams next year, I'll stay here until I'm eighteen. River School is a secondary school, about twenty minutes away from my home by bike. We go to school every weekday from eight forty five am to three fifteen pm. We have a large sports ground for football and tennis, where we can play both during and after school hours. After school activities, such as sports clubs and language societies, are popular too. During the school year there are usually visits to museums and to camps for activities, such as climbing and walking in the country",
                                        "guid": "a0122b7e01264b8483c28d5894202d02",
                                        "index": "0"
                                    }
                                },
                                "layout": "1",
                                "audioseconds": "54",
                                "choosetype": "1",
                                "tipsaudioSeconds": "0",
                                "tipsaudio": "",
                                "answers": "",
                                "text": "My name is Tom, and I'm fifteen. I've been at River School since I was eleven. If I pass my exams next year, I'll stay here until I'm eighteen.\r\nRiver School is a secondary school, about twenty minutes away from my home by bike. We go to school every weekday from 8:45 a.m to 3:15 p.m. We have a large sports ground for football and tennis, where we can play both during and after school hours. After-school activities, such as sports clubs and language societies, are popular too. During the school year there are usually visits to museums and to camps for activities, such as climbing and walking in the country.",
                                "index": "1",
                                "audiotext": "",
                                "prepareseconds": "60",
                                "presubmitmaxseconds": "0"
                            }
                        ],
                        "audio": "",
                        "guid": "6cf08255c0804be38888a429c7fe5836",
                        "videoseconds": "0",
                        "image": "",
                        "video": "",
                        "tipsaudioseconds": "0",
                        "times": "0",
                        "promptaudioseconds": "0",
                        "answerseconds": "60",
                        "audioseconds": "0",
                        "title": "",
                        "tipsaudio": "",
                        "text": "",
                        "index": "1",
                        "audiotext": "",
                        "prepareseconds": "60",
                        "promptaudio": "",
                        "presubmitmaxseconds": "0"
                    }
                ]
            },

        ],
        "papertemplateid": "",
        "type": "1"
    }
}

export default (state = JSON.parse(JSON.stringify(initialState)), action) => {
    let { value, path } = action;
    switch (action.type) {
        case constent.INIT_PAPER_DATA:
            return {
                ...state,
                paperData: value,
                audioPath: path
            }
        case constent.CHANGE_PAPER_DATA:
            return {
                ...state,
                paperData: value
            }
        case constent.RESET_QUESTION:
            return {
                ...state,
                questionIndex: 0
            }
        case constent.RESET_AREA:
            return {
                ...state,
                areaIndex: 0
            }
        case constent.SET_QUESTION_INDEX:
            return {
                ...state,
                questionIndex: action.value
            }
        case constent.SET_AREA_INDEX:
            return {
                ...state,
                areaIndex: action.value
            }
        case constent.SET_CONTENT_INDEX:
            return {
                ...state,
                contentIndex: action.value
            }
        case constent.NEXT_QUESTION:
            return {
                ...state,
                questionIndex: state.questionIndex + 1
            }
        case constent.NEXT_AREA:
            return {
                ...state,
                areaIndex: state.areaIndex + 1
            }
        case constent.CHANGE_PAPER_ANDWER:
            return {
                ...state,
                paperAnswer: action.value
            }
        case constent.CHANGE_LISTEN_GUIDE:
            return {
                ...state,
                listenGuide: action.value
            }
        case constent.CHANGE_LISTEN_QUESTION:
            return {
                ...state,
                listenQustion: action.value
            }
        case constent.CHANGE_SECTION2:
            return {
                ...state,
                ifSection2: action.value
            }
        case constent.CHANGE_SELECTED_PAPER:
            return {
                ...state,
                selectedPaper: action.value
            }
        case constent.RESET_PAPER_REDUCER:
            return JSON.parse(JSON.stringify(initialState));
        default:
            return state;
    }
}

