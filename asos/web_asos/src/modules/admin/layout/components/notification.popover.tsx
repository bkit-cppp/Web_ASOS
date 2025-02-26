import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import ExpandableList from '@/components/list/expandable.list';
import useExpandableListRef from '@/hooks/useExpandableListRef';

interface Notification {
    id: string;
    title: string;
    content: string;
    time: string;
}

interface NotificationPopoverProps {
    children: React.ReactNode;
}

const NotificationPopover: React.FC<NotificationPopoverProps> = ({ children }) => {
    const { listRef, handleRemove } = useExpandableListRef();

    const NotificationComponent = (notification: Notification) => {
        return (
            <div className="p-4 border-b last:border-b-0">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-semibold">{notification.title}</h3>
                        <p className="text-sm text-gray-500">{notification.content}</p>
                        <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleRemove(notification.id)}>
                        <Trash2 className="w-4 h-4 text-gray-400" />
                    </Button>
                </div>
            </div>
        );
    };

    const Skeleton = () => {
        return <div className="w-0 h-0"></div>;
    };

    return (
        <Popover>
            <PopoverTrigger asChild>{children}</PopoverTrigger>
            <PopoverContent className="w-80 p-0 mt-1">
                <ScrollArea className="h-fit max-h-[300px]">
                    <ExpandableList
                        ref={listRef}
                        api="/identity-service/api/Notification/filter"
                        content={NotificationComponent}
                        totalRecord={4}
                        skeleton={Skeleton()}
                        variant="outline"
                    />
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
};

export default NotificationPopover;
