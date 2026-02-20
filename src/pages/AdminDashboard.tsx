import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Edit2, Trash2, Plus, Check, X } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';

interface Service {
    id: number;
    name: string;
    description: string;
    price: number;
    duration: string;
    category: string;
}

interface Booking {
    order_id: string;
    user_name: string;
    user_email: string;
    service_name: string;
    date: string;
    time: string;
    price: number;
    payment_status: string;
}

interface User {
    user_id: number;
    email: string;
    name: string;
    role: string;
}

const AdminDashboard = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('bookings');

    // Form states
    const [newService, setNewService] = useState({ name: '', description: '', price: 0, duration: '30 min', category: 'Haircuts' });
    const [editingService, setEditingService] = useState<Service | null>(null);

    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        if (!isAuthenticated || user?.role !== 'admin') {
            navigate('/login');
            return;
        }
        loadDashboardData();
    }, [isAuthenticated, user?.role]);

    const loadDashboardData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('auth_token');
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            };

            // Fetch bookings
            const bookingsRes = await fetch(`${API_BASE_URL}/admin/bookings.php`, { headers });
            const bookingsData = await bookingsRes.json();
            if (bookingsData.success) setBookings(bookingsData.bookings || []);

            // Fetch users
            const usersRes = await fetch(`${API_BASE_URL}/admin/users.php`, { headers });
            const usersData = await usersRes.json();
            if (usersData.success) setUsers(usersData.users || []);

            // Fetch services
            const servicesRes = await fetch(`${API_BASE_URL}/admin/services.php`, { headers });
            const servicesData = await servicesRes.json();
            if (servicesData.success) setServices(servicesData.services || []);
        } catch (err) {
            console.error('Failed to load dashboard:', err);
            toast({
                title: 'Error',
                description: 'Failed to load dashboard data.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const addService = async () => {
        if (!newService.name || newService.price <= 0) {
            toast({
                title: 'Error',
                description: 'Please fill in all required fields.',
                variant: 'destructive',
            });
            return;
        }

        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch(`${API_BASE_URL}/admin/services.php`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newService),
            });
            const data = await response.json();
            if (data.success) {
                toast({
                    title: 'Service Added',
                    description: 'New service has been added successfully.',
                });
                setNewService({ name: '', description: '', price: 0, duration: '30 min', category: 'Haircuts' });
                loadDashboardData();
            } else {
                toast({
                    title: 'Error',
                    description: data.message || 'Failed to add service.',
                    variant: 'destructive',
                });
            }
        } catch (err) {
            toast({
                title: 'Error',
                description: 'Failed to add service.',
                variant: 'destructive',
            });
        }
    };

    const updateBookingStatus = async (orderId: string, status: string) => {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch(`${API_BASE_URL}/admin/bookings.php`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ order_id: orderId, payment_status: status }),
            });
            const data = await response.json();
            if (data.success) {
                toast({
                    title: 'Updated',
                    description: 'Booking status updated.',
                });
                loadDashboardData();
            }
        } catch (err) {
            toast({
                title: 'Error',
                description: 'Failed to update booking.',
                variant: 'destructive',
            });
        }
    };

    const deleteService = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this service?')) return;
        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch(`${API_BASE_URL}/admin/services.php?id=${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (data.success) {
                toast({
                    title: 'Deleted',
                    description: 'Service has been deleted.',
                });
                loadDashboardData();
            }
        } catch (err) {
            toast({
                title: 'Error',
                description: 'Failed to delete service.',
                variant: 'destructive',
            });
        }
    };

    return (
        <PageTransition>
            <div className="min-h-screen flex flex-col bg-background">
                <Navigation />
                <div className="flex-1 px-4 py-28 pt-32 container mx-auto">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
                        <p className="text-muted-foreground">Manage all aspects of your business</p>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <p className="text-muted-foreground">Loading dashboard...</p>
                        </div>
                    ) : (
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="bookings">Bookings ({bookings.length})</TabsTrigger>
                                <TabsTrigger value="services">Services ({services.length})</TabsTrigger>
                                <TabsTrigger value="users">Users ({users.length})</TabsTrigger>
                            </TabsList>

                            {/* Bookings Tab */}
                            <TabsContent value="bookings" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>All Bookings</CardTitle>
                                        <CardDescription>Manage customer bookings and payments</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {bookings.length === 0 ? (
                                                <p className="text-muted-foreground">No bookings yet.</p>
                                            ) : (
                                                bookings.map((booking) => (
                                                    <Card key={booking.order_id} className="p-4 bg-muted/50">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div>
                                                                <p className="font-bold">{booking.user_name} - {booking.service_name}</p>
                                                                <p className="text-sm text-muted-foreground">{booking.user_email}</p>
                                                            </div>
                                                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${booking.payment_status === 'paid' ? 'bg-green-500/10 text-green-700' :
                                                                booking.payment_status === 'pending' ? 'bg-yellow-500/10 text-yellow-700' :
                                                                    'bg-red-500/10 text-red-700'
                                                                }`}>
                                                                {booking.payment_status}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm mb-3">{booking.date} at {booking.time} • KES {booking.price}</p>
                                                        <div className="flex gap-2">
                                                            {booking.payment_status !== 'paid' && (
                                                                <Button size="sm" onClick={() => updateBookingStatus(booking.order_id, 'paid')}>
                                                                    <Check className="w-4 h-4 mr-1" />
                                                                    Mark Paid
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </Card>
                                                ))
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Services Tab */}
                            <TabsContent value="services" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Add New Service</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-3">
                                            <div>
                                                <Label htmlFor="service-name">Service Name</Label>
                                                <Input
                                                    id="service-name"
                                                    value={newService.name}
                                                    onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                                                    placeholder="e.g., Classic Haircut"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="service-price">Price (KES)</Label>
                                                <Input
                                                    id="service-price"
                                                    type="number"
                                                    value={newService.price}
                                                    onChange={(e) => setNewService({ ...newService, price: parseFloat(e.target.value) })}
                                                    placeholder="0"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="service-category">Category</Label>
                                                <Input
                                                    id="service-category"
                                                    value={newService.category}
                                                    onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                                                    placeholder="e.g., Haircuts"
                                                />
                                            </div>
                                            <Button onClick={addService} className="w-full">
                                                <Plus className="w-4 h-4 mr-2" />
                                                Add Service
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>All Services</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            {services.length === 0 ? (
                                                <p className="text-muted-foreground">No services yet.</p>
                                            ) : (
                                                services.map((service) => (
                                                    <Card key={service.id} className="p-4 bg-muted/50 flex justify-between items-center">
                                                        <div>
                                                            <p className="font-bold">{service.name}</p>
                                                            <p className="text-sm text-muted-foreground">KES {service.price} • {service.duration} • {service.category}</p>
                                                        </div>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => deleteService(service.id)}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </Card>
                                                ))
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Users Tab */}
                            <TabsContent value="users" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>All Users</CardTitle>
                                        <CardDescription>View and manage registered users</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            {users.length === 0 ? (
                                                <p className="text-muted-foreground">No users yet.</p>
                                            ) : (
                                                users.map((u) => (
                                                    <Card key={u.user_id} className="p-4 bg-muted/50">
                                                        <div className="flex justify-between items-center">
                                                            <div>
                                                                <p className="font-bold">{u.name}</p>
                                                                <p className="text-sm text-muted-foreground">{u.email}</p>
                                                            </div>
                                                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${u.role === 'admin' ? 'bg-purple-500/10 text-purple-700' : 'bg-blue-500/10 text-blue-700'
                                                                }`}>
                                                                {u.role}
                                                            </span>
                                                        </div>
                                                    </Card>
                                                ))
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    )}
                </div>
                <Footer />
            </div>
        </PageTransition>
    );
};

export default AdminDashboard;
