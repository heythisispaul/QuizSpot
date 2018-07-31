import * as React from 'react';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { loadTheme, getTheme } from 'office-ui-fabric-react/lib/Styling';
import axios, { AxiosResponse } from 'axios';
import SongChoices from '../../HelperFunctions/SongChoices'
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';

interface IProps {
    
}

interface IMainState {
    currentSelection: string;
    songs: Array<any>,
    currSong: number;
}

let myTheme = getTheme(true);

export default class GameSelection extends React.Component<IProps, IMainState> {

    constructor(props: IProps) {
        super(props);
        
        this.state = {
            currentSelection: 'game',
            songs: [],
            currSong: 0
        }
    }

    public randomNumber = (): number => {
        return Math.floor((Math.random() * 99));
    }

    public componentDidMount() {
        axios.post('/myplaylist', {
            data: {
                token: localStorage.getItem('SpotifyQuizToken')
            }
        })
        .then((res: AxiosResponse) => {
            console.log(res.data);
            let firstSongAudio = new Audio(res.data[0].PlayBackLink);
            console.log(res.data[0]);
            console.log(res.data[0].PlayBackLink);
            // firstSongAudio.play();
            let songs = res.data;
            // firstSong.play();
            songs.forEach(song => {
                song.audio = new Audio(res.data[0].PlayBackLink);
            });
            this.setState({ songs });
        })
    }

    public render() {

            if (this.state.songs.length < 1) {
                return (
                    <Fabric>
                        <div className='centered'><Spinner size={SpinnerSize.large} /></div>
                    </Fabric>
                )
            }

            if (this.state.currentSelection == 'game') {
                return (
                    <React.Fragment>
                        <p>Hello</p>
                        <DefaultButton text="play" onClick={() => this.state.songs[this.state.currSong].audio.play()}/>
                        <DefaultButton text='next song' onClick={() => { let song = this.state.currSong; this.state.songs[song].audio.pause(); this.setState({ currSong: song + 1 })}} />
                        {this.state.songs.length > 0 ? <div><p>You're listening to {this.state.songs[this.state.currSong].Title} by {this.state.songs[this.state.currSong].Artist}</p><PrimaryButton text="stop" onClick={() => this.state.songs[this.state.currSong].audio.pause()}/></div> : null}
                        {this.state.songs[this.state.currSong].Options.map((e, i) => {
                            console.log(e);
                            return (
                                <div id={i} className='fakeButton'>
                                    <p>{e.title}</p>
                                </div>
                            )
                        })}
                    </React.Fragment>
                )
            }
            else {
                return <p>I'm still saying hello for now</p>
            }
   }
}