// outer
import React, {FunctionComponent} from 'react';


// local
import {useGlobalContext} from "../../../../../App";





interface OwnProps {}

type Props = OwnProps;

const BackgroundMenuItem: FunctionComponent<Props> = () => {

    const context = useGlobalContext()
    let menuStatus = context.leftMenuStatus[1] as React.Dispatch<React.SetStateAction<any>>

    return (
        <li style={{position:"relative"}}>
            <span onClick={()=>menuStatus({type:"background",props:{}})}> Background </span>
        </li>
    );
};


export default BackgroundMenuItem;
