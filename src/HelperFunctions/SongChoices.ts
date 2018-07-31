export default class SongChoices {
    Audio: any;
    Title: string;
    Options: Array<ITitleOptions>;
    ImageURL: string;
    Artist: string;
    PlayBackLink: string;
    getAudio = () => {
        this.Audio = new Audio(this.PlayBackLink);
    }
    play = () => {
        this.Audio.play();
    }
    stop = () => {
        this.Audio.pause();
    }

    constructor(playbackLink: string, titleString: string, artist: string, options:Array<ITitleOptions>, imageurl: string) {
        this.PlayBackLink = playbackLink;
        this.Title = titleString,
        this.Options = [{
            title: titleString,
            correct: true
        }];
        this.ImageURL = imageurl;
        this.Artist = artist;
    }
}

export interface ITitleOptions {
    title: string;
    correct: boolean;
}