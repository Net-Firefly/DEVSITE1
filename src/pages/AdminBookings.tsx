import { useEffect, useState } from 'react';
import PageTransition from '@/components/PageTransition';
import { Table } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

const AdminBookings = () => {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/bookings');
            const data = await res.json();
            if (data.success) setBookings(data.bookings);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const markPaid = async (orderId: string) => {
        try {
            const res = await fetch(`/api/bookings/${orderId}/mark-paid`, { method: 'POST' });
            const data = await res.json();
            if (data.success) fetchBookings();
        } catch (err) {
            console.error('Mark paid error', err);
        }
    };

    return (
        <PageTransition>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Admin — Bookings</h1>
                {loading && <p>Loading…</p>}
                {!loading && (
                    <div className="space-y-4">
                        {bookings.map((b) => (
                            <div key={b.order_id} className="p-4 border rounded-md">
                                <div className="flex justify-between">
                                    <div>
                                        <div className="font-semibold">{b.name} — {b.service_name}</div>
                                        <div className="text-sm text-muted-foreground">{b.order_id} • {b.date} {b.time} • KES {b.price}</div>
                                        <div className="text-sm">{b.email} • {b.phone}</div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="text-sm">Status: <span className="font-medium">{b.payment_status}</span></div>
                                        {b.calendar_event_link && (
                                            <a href={b.calendar_event_link} target="_blank" rel="noreferrer" className="text-xs text-blue-400 underline">Open Calendar Event</a>
                                        )}
                                        <Button size="sm" onClick={() => markPaid(b.order_id)}>Mark Paid</Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {bookings.length === 0 && <p>No bookings found</p>}
                    </div>
                )}
            </div>
        </PageTransition>
    );
};

export default AdminBookings;