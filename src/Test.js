import React from 'react';
import { ParentSize } from '@vx/responsive';
import WorkArea from './components/WorkArea';

export default function Test() {
    return(
        <div className="flex flex-col w-screen h-screen">
            <div className="">
                <ParentSize>
                    {({width, height}) => (
                        <WorkArea projectId={1} width={width} height={height} />
                    )}
                </ParentSize>
            </div>
        </div>
    );
}