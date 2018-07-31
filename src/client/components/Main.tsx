import * as React from 'react';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { loadTheme, getTheme } from 'office-ui-fabric-react/lib/Styling';
import axios from 'axios';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import GameSelection from './GameSelection';


interface IProps {
}

interface IMainState {
    currentSelection: string;
}

let myTheme = getTheme(true);

export default class Main extends React.Component<IProps, IMainState> {

    
    constructor(props: IProps) {
        super(props);
        
        this.state = {
            currentSelection: 'game'
        }
    }

   public render() {

            if (this.state.currentSelection == 'game') {
                return (
                    <GameSelection />
                )
            }
   }
}