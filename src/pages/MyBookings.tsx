import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, MapPin, DollarSign, Trash2 } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';

interface Booking {
    order_id: string;
    service_name: string;
    date: string;
    time: string;
    notes: string;
    price: number;
    payment_status: 'pending' | 'paid' | 'failed';
    created_at: string;
}

const MyBookings = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        fetchBookings();
    }, [isAuthenticated]);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch(`${API_BASE_URL}/bookings/user.php`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (data.success) {
                setBookings(data.bookings || []);
            }
        } catch (err) {
            console.error('Failed to fetch bookings:', err);
            toast({
                title: 'Error',
                description: 'Failed to load your bookings.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const cancelBooking = async (orderId: string) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;
        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch(`${API_BASE_URL}/bookings/cancel.php?order_id=${orderId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (data.success) {
                toast({
                    title: 'Booking Cancelled',
                    description: 'Your booking has been cancelled successfully.',
                });
                fetchBookings();
            } else {
                toast({
                    title: 'Error',
                    description: data.message || 'Failed to cancel booking.',
                    variant: 'destructive',
                });
            }
        } catch (err) {
            toast({
                title: 'Error',
                description: 'Failed to cancel booking.',
                variant: 'destructive',
            });
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid':
                return 'bg-green-500/10 text-green-700';
            case 'pending':
                return 'bg-yellow-500/10 text-yellow-700';
            case 'failed':
                return 'bg-red-500/10 text-red-700';
            default:
                return 'bg-gray-500/10 text-gray-700';
        }
    };

    return (
        <PageTransition>
            <div className="min-h-screen flex flex-col bg-background">
                <Navigation />
                <div className="flex-1 px-4 py-28 pt-32 container mx-auto">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-foreground mb-2">My Bookings</h1>
                        <p className="text-muted-foreground">Manage and view all your salon appointments</p>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <p className="text-muted-foreground">Loading your bookings...</p>
                        </div>
                    ) : bookings.length === 0 ? (
                        <Card className="text-center py-12">
                            <CardContent>
                                <p className="text-muted-foreground mb-4">You haven't made any bookings yet.</p>
                                <Button onClick={() => navigate('/contact')}>Book Now</Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {bookings.map((booking) => (
                                <Card key={booking.order_id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <CardTitle className="text-lg">{booking.service_name}</CardTitle>
                                                <CardDescription className="text-xs mt-1">{booking.order_id}</CardDescription>
                                            </div>
                                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(booking.payment_status)}`}>
                                                {booking.payment_status.charAt(0).toUpperCase() + booking.payment_status.slice(1)}
                                            </span>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-primary" />
                                                <span>{booking.date}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-primary" />
                                                <span>{booking.time}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <DollarSign className="w-4 h-4 text-primary" />
                                                <span>KES {booking.price.toLocaleString()}</span>
                                            </div>
                                        </div>
                                        {booking.notes && (
                                            <div className="text-sm text-muted-foreground bg-muted p-2 rounded">
                                                <p className="font-medium mb-1">Notes:</p>
                                                <p>{booking.notes}</p>
                                            </div>
                                        )}
                                        <div className="pt-3 border-t">
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                className="w-full"
                                                onClick={() => cancelBooking(booking.order_id)}
                                            >
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Cancel Booking
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
                <Footer />
            </div>
        </PageTransition>
    );
};

export default MyBookings;
