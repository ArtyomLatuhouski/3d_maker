//outer
import React, {Dispatch, FunctionComponent, SetStateAction, useEffect, useMemo, useRef, useState} from 'react';
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

//local
import {creatPerspectiveCamera} from "../../threejs/scene&camera";

import {lightThreePoints, planeCreator} from "../../threejs/otherConstructors";
import "./backCanvas.scss"
import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader";
import {EventBackgroundCanvas} from "../../threejs/backfroundCanvas";

interface OwnProps {
    backCanvasObject: Dispatch<SetStateAction<any>>
    setBackCanvasPosition:Dispatch<SetStateAction<any>>
}

type Props = OwnProps

const BackCanvas: FunctionComponent<Props> = (props) => {
    const canvasContainer = useRef(null)

    const [width] = useState(window.innerWidth)
    const [height] = useState(window.innerHeight)

    //creat camera
    const camera = useMemo(() => creatPerspectiveCamera(width, height, -1.4, 1.7, 1.5), [width, height])

    //creat canvas object
    const canvas = useRef(new EventBackgroundCanvas(camera, width, height))

    //initialization canvas in component and mount
    useEffect(() => canvas.current.init(canvasContainer,false), [])

    // add Lights
    useEffect(() => canvas.current.addLights(lightThreePoints()), [])

    // add window resize effect
    useEffect(() => {
        canvas.current.startWindowResize()
        return canvas.current.stopWindowResize
    }, [])

    // add plane element for event on monitor
    useEffect(() => {
        let eventElement = (planeCreator(0.82, 0.54, 1, 1))
        eventElement.name = "planeBack"
        canvas.current.addElement(eventElement, "planeBack", false,false, -0.5, 1.68, 0)
    }, [])

    // add background GLTF 3d object
    useEffect(() => {
        const loader = new GLTFLoader();
        loader.load('models/back/scene.gltf', function (gltf) {
            canvas.current.addElement(gltf.scene, "background")
        }, undefined, function (error) {
            console.error(error)
        })
    }, [])

    // add robot GLTF 3d object
    useEffect(() => {
        const loader = new GLTFLoader();
        // DRACOLoader for load animations
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('../node_modules/three/examples/js/libs/draco');
        loader.setDRACOLoader(dracoLoader);
        loader.load('models/RobotExpressive.glb', function (gltf) {
            const element = gltf.scene
            element.receiveShadow = true
            element.castShadow = true
            element.scale.set(0.1, 0.1, 0.1)
            element.position.set(-1.45, 1.3, 0)
            element.rotateY(0.3)
            element.name = "robot"

            element.animations = gltf.animations

            const face = element.getObjectByName( 'Head_4' )
            element.getObjectByName( 'Head_4' )

            // @ts-ignore
            face.morphTargetInfluences=[1,0,0]

            canvas.current.addElement(element, "robot")
        })
    }, [])

    useEffect(() => {
        //add onclick events on plane monitor and robot
        canvas.current.clickOnMonitor(props.setBackCanvasPosition,canvas.current.canvas as HTMLCanvasElement)

        // event click on robot with prop callback
        canvas.current.clickOnRobot()
    }, [])


    // get back canvas object for global context
    useEffect(()=>{
        props.backCanvasObject(canvas.current)
    },[])

    return (
            <div ref={canvasContainer} className="backCanvas__container"
                 style={{width: "100vw", height: "100vh", position: "fixed", zIndex: -1}}/>
    );
};

export default BackCanvas;
