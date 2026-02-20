import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { SERVER_BASE_URL } from "@/lib/api";

// Stripe
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

interface BookingFormProps {
  isOpen: boolean;
  onClose: () => void;
  service: {
    id: number;
    name: string;
    price: number;
    duration: string;
  } | null;
}

const timeSlots = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
  "5:30 PM",
];

const BookingForm = ({ isOpen, onClose, service }: BookingFormProps) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    notes: "",
    promoCode: "",
  });
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"mpesa" | "card" | null>(null);
  const [mpesaData, setMpesaData] = useState({
    mpesaPhone: "",
  });
  const [cardData, setCardData] = useState({
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // Stripe card processor component
  function CardPayment({ amount, name, email, phone, formData, service, onSuccess, onError }: { amount: number; name: string; email: string; phone: string; formData: any; service: any; onSuccess: (pi: any) => void; onError: (err: any) => void }) {
    const stripe = useStripe();
    const elements = useElements();
    const [isPaying, setIsPaying] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handlePay = async () => {
      if (!stripe || !elements) {
        setError('Payment system not loaded yet. Please try again in a moment.');
        return;
      }

      // Basic validation
      if (!formData.name || !formData.email || !formData.phone || !formData.date || !formData.time) {
        setError('Please complete all booking details (name, email, phone, date, time) before paying.');
        return;
      }

      try {
        setIsPaying(true);

        // Create booking on server first
        const createResp = await fetch(`${SERVER_BASE_URL}/api/bookings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            service_id: service?.id,
            service_name: service?.name,
            date: formData.date,
            time: formData.time,
            notes: formData.notes,
            price: Math.round(amount),
            payment_method: 'card'
          }),
        });

        const created = await createResp.json();
        if (!created.success || !created.booking) {
          throw new Error(created.message || 'Failed to create booking');
        }

        const orderId = created.booking.order_id;

        // Create PaymentIntent with orderId in metadata
        const resp = await fetch(`${SERVER_BASE_URL}/api/stripe/create-payment-intent`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: Math.round(amount), currency: 'kes', metadata: { orderId } }),
        });

        const data = await resp.json();
        if (!data.clientSecret) {
          throw new Error(data.message || 'Failed to create payment intent');
        }

        const card = elements.getElement(CardElement);
        const confirm = await stripe.confirmCardPayment(data.clientSecret, {
          payment_method: { card, billing_details: { name, email, phone } },
        });

        if (confirm.error) {
          setError(confirm.error.message || 'Payment failed');
          onError && onError(confirm.error);
        } else if (confirm.paymentIntent && confirm.paymentIntent.status === 'succeeded') {
          onSuccess(confirm.paymentIntent);
        } else {
          setError('Payment not completed');
          onError && onError({ message: 'Payment not completed' });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Payment error');
        onError && onError(err);
      } finally {
        setIsPaying(false);
      }
    };

    return (
      <div className="mt-4 space-y-3 bg-white/5 p-3 rounded border border-white/10">
        <div className="space-y-2">
          <Label className="font-body text-sm">Card Details</Label>
          <div className="p-3 bg-black/5 rounded">
            <CardElement options={{ style: { base: { color: '#fff', '::placeholder': { color: '#888' } }, invalid: { color: '#ff6363' } } }} />
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <div className="pt-3">
            <Button type="button" onClick={handlePay} disabled={isPaying || !stripe}>
              {isPaying ? 'Processing...' : `Pay KES ${amount.toLocaleString()}`}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Promo codes with service type restrictions
  const promoCodes: Record<string, { discount: number; description: string; applicableServices: string[] }> = {
    WELCOME20: { discount: 0.2, description: "20% off for new customers", applicableServices: ["all"] },
    COMBO25: { discount: 0.25, description: "25% off haircut + beard combo", applicableServices: ["haircuts"] },
    FRIDAY15: { discount: 0.15, description: "15% off all nail services", applicableServices: ["nails"] },
  };

  // Determine service category
  const getServiceCategory = (): string => {
    if (!service) return "";
    const name = service.name.toLowerCase();
    if (name.includes("nail") || name.includes("pedicure") || name.includes("manicure")) return "nails";
    if (name.includes("facial") || name.includes("massage") || name.includes("aromatherapy") || name.includes("steam") || name.includes("spa")) return "spa";
    return "haircuts";
  };

  const serviceCategory = getServiceCategory();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTimeChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      time: value,
    }));
  };

  const applyPromoCode = () => {
    const code = formData.promoCode.toUpperCase().trim();
    if (!code) {
      setAppliedPromo(null);
      return;
    }

    if (promoCodes[code]) {
      const promoData = promoCodes[code];
      // Check if promo is applicable to this service
      if (promoData.applicableServices[0] !== "all" && !promoData.applicableServices.includes(serviceCategory)) {
        alert(`This promo code is not valid for ${serviceCategory} services. Valid for: ${promoData.applicableServices.join(", ")}`);
        setAppliedPromo(null);
        return;
      }
      setAppliedPromo({ code, discount: promoData.discount });
    } else {
      alert("Invalid promo code!");
      setAppliedPromo(null);
    }
  };

  const calculatePrice = () => {
    if (!service) return { original: 0, discount: 0, final: 0 };
    const original = service.price;
    const discountAmount = appliedPromo ? original * appliedPromo.discount : 0;
    const final = original - discountAmount;
    return { original, discount: discountAmount, final };
  };

  const pricing = calculatePrice();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate payment method selection
    if (!paymentMethod) {
      alert("Please select a payment method");
      return;
    }

    // Validate payment details
    if (paymentMethod === "mpesa" && !mpesaData.mpesaPhone) {
      alert("Please enter your M-Pesa phone number");
      return;
    }

    if (paymentMethod === "card") {
      // Card payments are handled via Stripe Elements using the Pay button in the Card section
      alert("Please complete the payment using the 'Pay' button inside the Card payment section.");
      return;
    }

    setIsProcessing(true);

    try {
      if (paymentMethod === "mpesa") {
        // Create a booking first, then initiate M-Pesa using the returned order ID
        try {
          const createResp = await fetch(`${SERVER_BASE_URL}/api/bookings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              service_id: service?.id,
              service_name: service?.name, service_duration: service?.duration, date: formData.date,
              time: formData.time,
              notes: formData.notes,
              price: Math.round(pricing.final),
              payment_method: 'mpesa'
            }),
          });

          const created = await createResp.json();
          if (!created.success || !created.booking) throw new Error(created.message || 'Booking creation failed');

          const orderId = created.booking.order_id;

          const response = await fetch(`${SERVER_BASE_URL}/api/mpesa-initiate`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              phone: mpesaData.mpesaPhone,
              amount: pricing.final,
              orderId: orderId,
              email: formData.email,
            }),
          });

          const data = await response.json();

          if (data.success) {
            alert(`✓ M-Pesa Prompt Sent!\n\n${data.message}\n\nPhone: ${mpesaData.mpesaPhone}\nAmount: KES ${pricing.final.toLocaleString()}\nOrder ID: ${orderId}`);
            handleClose();
          } else {
            alert(`Payment Failed:\n\n${data.message}\n\nMake sure:\n1. Phone number is correct\n2. M-Pesa server is running\n3. Server credentials are configured`);
          }
        } catch (err) {
          console.error('MPesa booking/initiate error', err);
          alert('Failed to create booking or initiate M-Pesa. Check console for details.');
        }
      } else if (paymentMethod === "card") {
        // Card payment processing
        const totalAmount = appliedPromo
          ? `KES ${pricing.final.toLocaleString()} (was KES ${pricing.original.toLocaleString()})`
          : `KES ${pricing.original.toLocaleString()}`;

        alert(`✓ Card Payment Processed!\n\nBooking confirmed for ${formData.name}!\n\nService: ${service?.name}\nDate: ${formData.date}\nTime: ${formData.time}\nTotal: ${totalAmount}\n\nPayment Method: Card\nCard ending in: ${cardData.cardNumber.slice(-4)}`);
        handleClose();
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert(`Error processing payment:\n\n${error instanceof Error ? error.message : "Unknown error"}\n\nMake sure the payment server is running at ${SERVER_BASE_URL}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      date: "",
      time: "",
      notes: "",
      promoCode: "",
    });
    setAppliedPromo(null);
    setPaymentMethod(null);
    setMpesaData({ mpesaPhone: "" });
    setCardData({
      cardName: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    });
    setIsProcessing(false);
    onClose();
  };

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Book Appointment</DialogTitle>
          <DialogDescription className="font-body">
            {service?.name && (
              <div className="mt-2">
                <p className="text-foreground font-semibold">{service.name}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  KES {service.price.toLocaleString()} • {service.duration}
                </p>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>

        {!isAuthenticated ? (
          <div className="space-y-4 py-6">
            <p className="text-center text-muted-foreground">
              You need to be logged in to book an appointment.
            </p>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  handleClose();
                  navigate('/login');
                }}
                className="flex-1"
              >
                Login
              </Button>
              <Button
                onClick={() => {
                  handleClose();
                  navigate('/signup');
                }}
                variant="outline"
                className="flex-1"
              >
                Sign Up
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="font-body">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="font-body"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="font-body">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="font-body"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="font-body">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="+254 7xx xxx xxx"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="font-body"
              />
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date" className="font-body">Preferred Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
                min={today}
                required
                className="font-body"
              />
            </div>

            {/* Time */}
            <div className="space-y-2">
              <Label htmlFor="time" className="font-body">Preferred Time</Label>
              <Select value={formData.time} onValueChange={handleTimeChange}>
                <SelectTrigger className="font-body">
                  <SelectValue placeholder="Select a time slot" />
                </SelectTrigger>
                <SelectContent className="font-body">
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="font-body">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Any special requests or preferences..."
                value={formData.notes}
                onChange={handleInputChange}
                className="font-body resize-none"
                rows={3}
              />
            </div>

            {/* Promo Code Section */}
            <div className="space-y-3 border-t border-white/10 pt-4">
              <Label htmlFor="promoCode" className="font-body">Promo Code (Optional)</Label>
              <div className="flex gap-2">
                <Input
                  id="promoCode"
                  name="promoCode"
                  placeholder="e.g., WELCOME20"
                  value={formData.promoCode}
                  onChange={handleInputChange}
                  className="font-body flex-1 uppercase"
                />
                <Button
                  type="button"
                  onClick={applyPromoCode}
                  variant="outline"
                  className="font-body"
                >
                  Apply
                </Button>
              </div>
              {appliedPromo && (
                <div className="p-2 bg-green-500/10 border border-green-500/50 rounded-lg">
                  <p className="text-xs text-green-400 font-body">✓ {promoCodes[appliedPromo.code]?.description}</p>
                </div>
              )}
            </div>

            {/* Payment Method Section */}
            <div className="space-y-4 border-t border-white/10 pt-4">
              <Label className="font-body text-base font-semibold">Select Payment Method</Label>

              <div className="space-y-3">
                {/* M-Pesa Option */}
                <div
                  onClick={() => setPaymentMethod("mpesa")}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition ${paymentMethod === "mpesa"
                    ? "border-green-500 bg-green-500/10"
                    : "border-white/20 hover:border-white/40"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "mpesa"
                      ? "border-green-500 bg-green-500"
                      : "border-white/40"
                      }`}>
                      {paymentMethod === "mpesa" && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">M-Pesa</p>
                      <p className="text-xs text-muted-foreground">Pay using M-Pesa mobile money</p>
                    </div>
                  </div>

                  {/* M-Pesa Form */}
                  {paymentMethod === "mpesa" && (
                    <div className="mt-4 space-y-3 bg-white/5 p-3 rounded border border-white/10">
                      <div className="space-y-2">
                        <Label htmlFor="mpesaPhone" className="font-body text-sm">M-Pesa Phone Number</Label>
                        <Input
                          id="mpesaPhone"
                          placeholder="+254 7xx xxx xxx"
                          value={mpesaData.mpesaPhone}
                          onChange={(e) => setMpesaData({ mpesaPhone: e.target.value })}
                          className="font-body"
                        />
                        <p className="text-xs text-muted-foreground">You will receive a prompt to complete the payment</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Option */}
                <div
                  onClick={() => setPaymentMethod("card")}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition ${paymentMethod === "card"
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-white/20 hover:border-white/40"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "card"
                      ? "border-blue-500 bg-blue-500"
                      : "border-white/40"
                      }`}>
                      {paymentMethod === "card" && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Debit / Credit Card</p>
                      <p className="text-xs text-muted-foreground">Pay using Visa, Mastercard, or other cards</p>
                    </div>
                  </div>

                  {/* Card Form */}
                  {paymentMethod === "card" && (
                    <div className="mt-4">
                      <Elements stripe={stripePromise}>
                        <CardPayment
                          amount={pricing.final}
                          name={formData.name}
                          email={formData.email}
                          phone={formData.phone}
                          formData={formData}
                          service={service}
                          onSuccess={(pi) => {
                            alert(`✓ Payment successful!\n\nBooking confirmed for ${formData.name}.\nAmount: KES ${pricing.final.toLocaleString()}\nPayment ID: ${pi.id}`);
                            handleClose();
                          }}
                          onError={(err) => {
                            alert(`Payment failed: ${err?.message || 'Unknown error'}`);
                          }}
                        />
                      </Elements>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Pricing Display */}
            {service && (
              <div className="space-y-2 border-t border-white/10 pt-4 bg-white/5 p-4 rounded-lg">
                <div className="flex justify-between text-sm font-body">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="text-foreground">KES {pricing.original.toLocaleString()}</span>
                </div>
                {appliedPromo && (
                  <>
                    <div className="flex justify-between text-sm font-body">
                      <span className="text-red-400">Discount ({Math.round(appliedPromo.discount * 100)}%):</span>
                      <span className="text-red-400">-KES {pricing.discount.toLocaleString()}</span>
                    </div>
                    <div className="border-t border-white/10 pt-2 flex justify-between font-display text-lg font-bold">
                      <span className="text-foreground">Total:</span>
                      <span className="text-gold-gradient">KES {pricing.final.toLocaleString()}</span>
                    </div>
                  </>
                )}
                {!appliedPromo && (
                  <div className="border-t border-white/10 pt-2 flex justify-between font-display text-lg font-bold">
                    <span className="text-foreground">Total:</span>
                    <span className="text-gold-gradient">KES {pricing.original.toLocaleString()}</span>
                  </div>
                )}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1 font-body"
                disabled={isProcessing}
              >
                Cancel
              </Button>

              {paymentMethod === 'card' ? (
                <Button type="button" className="flex-1 font-body bg-gray-600 cursor-not-allowed" disabled>
                  Complete Booking & Pay (use Card section)
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="flex-1 font-body bg-primary hover:bg-primary/90"
                  disabled={isProcessing || !paymentMethod}
                >
                  {isProcessing ? "Processing Payment..." : "Complete Booking & Pay"}
                </Button>
              )}
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingForm;
