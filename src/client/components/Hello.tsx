import * as React from 'react';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { loadTheme, getTheme } from 'office-ui-fabric-react/lib/Styling';
import axios from 'axios';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import Header from './Header';
import Main from './Main';


interface IProps {
   compiler: string,
   framework: string,
}

interface IState {
    userId: string;
    loggedIn: boolean;
    loading: boolean;
    userName: string;
    imageURL: string;
    initials: string;
}

let myTheme = getTheme(true);

export class Hello extends React.Component<IProps, IState> {

    
    constructor(props: IProps) {
        super(props);
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.initializer = this.initializer.bind(this);
        
        this.state = {
            userId: undefined,
            loggedIn: false,
            loading: true,
            userName: undefined,
            imageURL: undefined,
            initials: undefined
        }
    }
    
    public componentDidMount() {
        if (localStorage.getItem('SpotifyQuizToken')) {
            axios.get('/loggedin/' + localStorage.getItem('SpotifyQuizToken'))
            .then(response => {
                console.log(response.status);
                if (response.status == 200) {
                    let spotifyInfo = response.data.data;
                    this.setState({ 
                        loggedIn: true,
                        loading: false,
                        userName: spotifyInfo.display_name,
                        userId: spotifyInfo.id,
                        imageURL: spotifyInfo.images["0"].url,
                        initials: this.initializer(spotifyInfo.display_name)
                    });
                }
                else {
                    localStorage.removeItem('SpotifyQuizToken');
                    this.setState({
                        loggedIn: false,
                        loading: false
                    })
                }
            });
        }
        else {
            this.setState({ loading: false });
        }
    }

    private initializer = (a: string): string => {
        let initials: string = '';
        let names: Array<string> = a.split(' ');
        names.length > 1 ? initials = names[0].charAt(0) + names[1].charAt(0) : initials = names[0].charAt(0) + names[0].charAt(1);
        return initials;
    }

    private login = () => {
        window.location.href="/login";
    }

    private logout = () => {
        localStorage.removeItem('SpotifyQuizToken');
        this.setState({
            loggedIn: false,
            userId: undefined,
            userName: undefined,
            imageURL: undefined
        });
    }

   render() {

    if (this.state.loading) {
        return (
            <Fabric>
                <Header loggedIn={this.state.loggedIn} userName={this.state.userName} imageURL={this.state.imageURL} initials={this.state.initials} logout={this.logout}/>
                <div className='centered'><Spinner size={SpinnerSize.large} /></div>
            </Fabric>
        )
    }
    else {
        return (
            <Fabric>
                <Header loggedIn={this.state.loggedIn} userName={this.state.userName} imageURL={this.state.imageURL} initials={this.state.initials} logout={this.logout}/>
                <div className='w3-animate-opacity'>
                    {this.state.loggedIn ? <Main /> : <p>Log in to get started <DefaultButton text='Log In' onClick={() => window.location.href='/login'}/></p>}
                </div>
            </Fabric>
           )
        }
   }
}