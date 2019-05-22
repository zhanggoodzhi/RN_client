
const examBusiness = async (self) => {
    const newAnswer = { ...self.props.paperAnswer };
    newAnswer.studentno = self.props.No;
    newAnswer.paperguid = self.props.paperData.guid;
    newAnswer.papername = self.props.paperData.name;
    self.props.changePaperAnswer(newAnswer);
    for (let i = 0; i < self.props.paperData.areas.length; i++) {
        switch (self.props.paperData.areas[self.props.areaIndex].type) {
            // 单词音标认读
            case '24': {
                self.props.changeListenGuide(true);
                self.sendExamStatus();
                await self.listenPaperGuide();
                self.props.changeListenGuide(false);
                for (let j = 0; j < self.props.paperData.areas[self.props.areaIndex].questions.length; j++) {
                    self.sendExamStatus();
                    await self.prepare('prepare');
                    await self.prepareRecord();
                    await self.startPaperRecord();
                    await self.endRecord();
                    if (j !== self.props.paperData.areas[self.props.areaIndex].questions.length - 1) {
                        self.props.nextQuestion();
                    }
                }
                break;
            }
            //朗读短文
            case '3': {
                self.props.changeListenGuide(true);
                self.sendExamStatus();
                await self.listenPaperGuide();
                self.props.changeListenGuide(false);
                for (let j = 0; j < self.props.paperData.areas[self.props.areaIndex].questions.length; j++) {
                    self.sendExamStatus();
                    await self.prepare('prepare');
                    await self.prepareRecord();
                    await self.startPaperRecord();
                    await self.endRecord();
                    if (j !== self.props.paperData.areas[self.props.areaIndex].questions.length - 1) {
                        self.props.nextQuestion();
                    }
                }
                break;
            }
            //听短文答题
            case '2': {
                self.props.changeListenGuide(true);
                self.sendExamStatus();
                await self.listenPaperGuide();
                self.props.changeListenGuide(false);
                let audioPath;
                for (let j = 0; j < self.props.paperData.areas[self.props.areaIndex].questions.length; j++) {
                    audioPath = self.props.audioPath + self.props.paperData.areas[self.props.areaIndex].questions[self.props.questionIndex].audio;
                    self.sendExamStatus();
                    await self.prepare('read');
                    for (let x = 0; x < Number(self.props.paperData.areas[self.props.areaIndex].questions[self.props.questionIndex].times); x++) {
                        self.setQuestionTimeIndex(x + 1);
                        await self.promiseListenAudio(audioPath, 'listen');
                    }
                    await self.prepare('write', Number(self.props.paperData.areas[self.props.areaIndex].questions[self.props.questionIndex].answerseconds));
                    if (j !== self.props.paperData.areas[self.props.areaIndex].questions.length - 1) {
                        self.props.nextQuestion();
                    }
                }
                break;
            }
            // 情景问答
            case '7': {
                self.props.changeListenGuide(true);
                self.sendExamStatus();
                await self.listenPaperGuide();
                self.props.changeListenGuide(false);
                let audioPath;
                for (let j = 0; j < self.props.paperData.areas[self.props.areaIndex].questions.length; j++) {
                    await self.prepare('read');
                    for (let k = 0; k < self.props.paperData.areas[self.props.areaIndex].questions[self.props.questionIndex].contents.length; k++) {
                        audioPath = self.props.audioPath + self.props.paperData.areas[self.props.areaIndex].questions[self.props.questionIndex].contents[self.props.contentIndex].audio;
                        self.sendExamStatus();
                        for (let x = 0; x < Number(self.props.paperData.areas[self.props.areaIndex].questions[self.props.questionIndex].times); x++) {
                            self.setContentTimeIndex(x + 1);
                            console.log(audioPath);
                            self.props.changeListenQuestion(true);
                            await self.promiseListenAudio(audioPath, 'listen');
                            self.props.changeListenQuestion(false);
                        }
                        await self.prepareRecord();
                        await self.startPaperRecord();
                        await self.endRecord();
                        if (k !== self.props.paperData.areas[self.props.areaIndex].questions[self.props.questionIndex].contents.length - 1) {
                            self.props.setContentIndex(self.props.contentIndex + 1);
                        } else {
                            self.props.setContentIndex(0);
                        }
                    }
                    if (j !== self.props.paperData.areas[self.props.areaIndex].questions.length - 1) {
                        self.props.nextQuestion();
                    }
                }
                break;
            }
            // 听后记录并转述信息
            case '25': {
                self.props.changeListenGuide(true);
                self.sendExamStatus();
                await self.listenPaperGuide();
                self.props.changeListenGuide(false);
                let guidePath;
                let guidePath2;
                let audioPath;
                for (let j = 0; j < self.props.paperData.areas[self.props.areaIndex].questions.length; j++) {
                    let question = self.props.paperData.areas[self.props.areaIndex].questions[self.props.questionIndex];
                    guidePath = self.props.audioPath + question.promptaudio;
                    guidePath2 = self.props.audioPath + question.tipsaudio;
                    audioPath = self.props.audioPath + question.audio;
                    self.sendExamStatus();
                    self.props.changeListenGuide(true);
                    await self.promiseListenAudio(guidePath, 'listenGuide');
                    self.props.changeListenGuide(false);
                    await self.prepare('read');
                    for (let x = 0; x < Number(question.contents[self.props.contentIndex].times); x++) {
                        self.setContentTimeIndex(x + 1);
                        await self.promiseListenAudio(audioPath, 'listen');
                    }
                    await self.prepare('write', Number(question.contents[self.props.contentIndex].answerseconds));
                    self.refs.areaComponent.getWrappedInstance().updatePaperAnswer();
                    //第二节
                    self.props.setContentIndex(question.contents.length - 1);// 把contents设成最后一个，方便self.prepare中选content的时间
                    self.props.changeSection2(true);
                    self.sendExamStatus();
                    self.props.changeListenGuide(true);
                    await self.promiseListenAudio(guidePath2, 'listenGuide');
                    self.props.changeListenGuide(false);
                    self.setContentTimeIndex(1);
                    await self.promiseListenAudio(audioPath, 'listen');
                    await self.prepareRecord();
                    await self.startPaperRecord();
                    await self.endRecord();
                    self.props.changeSection2(false);
                    self.props.setContentIndex(0);
                    if (j !== self.props.paperData.areas[self.props.areaIndex].questions.length - 1) {
                        self.props.nextQuestion();
                    }
                }
                break;
            }
            // 快速应答
            case '14': {
                self.props.changeListenGuide(true);
                self.sendExamStatus();
                await self.listenPaperGuide();
                self.props.changeListenGuide(false);
                let audioPath;
                for (let j = 0; j < self.props.paperData.areas[self.props.areaIndex].questions.length; j++) {
                    for (let k = 0; k < self.props.paperData.areas[self.props.areaIndex].questions[self.props.questionIndex].contents.length; k++) {
                        audioPath = self.props.audioPath + self.props.paperData.areas[self.props.areaIndex].questions[self.props.questionIndex].contents[self.props.contentIndex].audio;
                        self.sendExamStatus();
                        for (let x = 0; x < Number(self.props.paperData.areas[self.props.areaIndex].questions[self.props.questionIndex].times); x++) {
                            self.setContentTimeIndex(x + 1);
                            console.log(audioPath);
                            self.props.changeListenQuestion(true);
                            self.refs.areaComponent.getWrappedInstance().startVideo();
                            await self.prepare('listen', Number(self.props.paperData.areas[self.props.areaIndex].questions[self.props.questionIndex].contents[self.props.contentIndex].videoseconds));
                            // await self.prepare('listen', 3);
                            self.refs.areaComponent.getWrappedInstance().endVideo();
                            self.props.changeListenQuestion(false);
                        }
                        await self.prepare('prepare');
                        await self.prepareRecord();
                        await self.startPaperRecord();
                        await self.endRecord();
                        if (k !== self.props.paperData.areas[self.props.areaIndex].questions[self.props.questionIndex].contents.length - 1) {
                            self.props.setContentIndex(self.props.contentIndex + 1);
                        } else {
                            self.props.setContentIndex(0);
                        }
                    }
                    if (j !== self.props.paperData.areas[self.props.areaIndex].questions.length - 1) {
                        self.props.nextQuestion();
                    }
                }
                break;
            }
        }
        self.props.resetQuestion();
        if (i !== self.props.paperData.areas.length - 1) {
            self.props.nextArea();
        } else {
            self.props.changeRightSideType('complete');
            socket.connectPaperServer(self.props.ip);
            console.log('答案', self.props.paperAnswer);
        }
    }
}
export default examBusiness;