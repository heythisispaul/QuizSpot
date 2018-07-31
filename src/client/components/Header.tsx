import * as React from 'react';
import { IPersonaSharedProps, Persona, PersonaSize, PersonaPresence, personaPresenceSize } from 'office-ui-fabric-react/lib/Persona';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { loadTheme, getTheme } from 'office-ui-fabric-react/lib/Styling';


interface IHeaderProps {
    loggedIn: boolean;
    userName: string;
    imageURL: string;
    initials: string;
    logout: () => void;
}

const Header: React.SFC<IHeaderProps> = (props) => {

    const persona: IPersonaSharedProps = {
        imageUrl: props.imageURL,
        imageInitials: props.initials,
        text: props.userName,
        secondaryText: 'QuizSpotter',
        showSecondaryText: false
      };
    
    if (props.loggedIn) {
        return (
            <div className='header'>
                    <img className='avatar' src={props.imageURL} />
                    <p className='header-text'>{props.userName}</p>
                    <DefaultButton text="Log Out" onClick={props.logout}/>
            </div>
        )
    }

    return (
        <div className='header'>
            <p>Hello!</p>
        </div>
    )
}

export default Header;