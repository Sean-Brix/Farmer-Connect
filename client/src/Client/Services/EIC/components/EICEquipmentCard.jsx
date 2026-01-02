import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";

// Equipment card component
export default function EICEquipmentCard({ item, onRequestClick, typeIcon, hasActiveRequest, isDisabled, disabledReason, onOpenMyRequests, isTutorialActive }) {
    
    const handleClick = () => {
        if (hasActiveRequest) {
            // Open My Requests modal instead of showing alert
            if (onOpenMyRequests) {
                onOpenMyRequests(item.id);
            }
            return;
        }
        if (isDisabled) {
            alert(disabledReason || 'Cannot request this item');
            return;
        }
        onRequestClick(item);
    };
    
    return (
        <Card data-tutorial="equipment-card" className="w-full h-[500px] flex flex-col">
            {/* Image Header - Fixed Height */}
            <CardHeader shadow={false} floated={false} className="h-48 m-0 rounded-t-xl rounded-b-none relative shrink-0">
                <img
                    src={item.img || '/src/Client/Services/EIC/Assets/default_image.jpg'}
                    alt={item.Name}
                    className="h-full w-full object-cover"
                />
                
                {/* Status Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    {hasActiveRequest && (
                        <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-yellow-500 text-white shadow-lg backdrop-blur-sm">
                            <i className="fa-solid fa-clock mr-1.5"></i>
                            ACTIVE
                        </span>
                    )}
                    <span className="px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-lg bg-green-600/90 backdrop-blur-sm ml-auto">
                        {item.category}
                    </span>
                </div>
            </CardHeader>
            
            {/* Content Body - Flexible Height */}
            <CardBody className="flex-1 flex flex-col px-4">
                {/* Equipment Name - Fixed Height */}
                <div className="h-14 mb-3">
                    <Typography variant="h6" color="blue-gray" className="font-bold text-lg line-clamp-2">
                        {item.Name}
                    </Typography>
                </div>
                
                {/* Description - Fixed Height */}
                <div className="h-12 mb-4">
                    <Typography variant="small" color="gray" className="text-sm leading-tight line-clamp-2">
                        {item.description}
                    </Typography>
                </div>
                
                {/* Stock Info - Prominent Display */}
                <div className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <i className="fa-solid fa-cubes text-green-600 text-lg"></i>
                            <span className="text-sm font-medium text-gray-700">Available Stock</span>
                        </div>
                        <span className={`text-xl font-bold ${
                            item.quantity > 5 ? 'text-green-600' : 
                            item.quantity > 0 ? 'text-yellow-600' : 
                            'text-red-600'
                        }`}>
                            {item.quantity}
                        </span>
                    </div>
                </div>
            </CardBody>
            
            {/* Action Button - Fixed Height */}
            <CardFooter className="pt-0 px-4 mt-auto">
                <Button
                    ripple={false}
                    fullWidth={true}
                    onClick={handleClick}
                    className={`h-12 normal-case text-sm font-bold shadow-md hover:shadow-lg transition-all duration-200 ${
                        hasActiveRequest
                            ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                            : isDisabled
                            ? 'bg-gray-400 hover:bg-gray-500 text-white'
                            : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                    data-tutorial="request-button"
                >
                    {hasActiveRequest ? (
                        <>
                            <i className="fa-solid fa-clock mr-2"></i>
                            View Active Request
                        </>
                    ) : isDisabled ? (
                        <>
                            <i className="fa-solid fa-ban mr-2"></i>
                            Currently Unavailable
                        </>
                    ) : (
                        <>
                            <i className="fa-solid fa-paper-plane mr-2"></i>
                            Request Equipment
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
}
