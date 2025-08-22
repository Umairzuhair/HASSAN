
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { MapPin, Phone, Mail, Clock, Plane } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'next/link';

interface CompanyInfo {
  address: string;
  hours: string;
  phones: string[];
  email: string;
  social: {
    facebook?: string;
    tiktok?: string;
    instagram?: string;
  };
}

interface CompanyMetadata {
  hours?: string;
  phones?: string[];
  email?: string;
  social?: {
    facebook?: string;
    tiktok?: string;
    instagram?: string;
  };
}

export const Footer = () => {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCompanyInfo();
  }, []);

  const fetchCompanyInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('website_content')
        .select('content, metadata')
        .eq('section', 'company_address')
        .single();

      if (error) {
        console.warn('Company info not found:', error);
        return;
      }

      if (data?.metadata) {
        // Type cast the metadata to our expected structure
        const metadata = data.metadata as CompanyMetadata;
        
        setCompanyInfo({
          address: data.content || '',
          hours: metadata.hours || '',
          phones: metadata.phones || [],
          email: metadata.email || '',
          social: metadata.social || {},
        });
      }
    } catch (error) {
      console.warn('Error fetching company info:', error);
    }
  };

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Metro International Duty Free (Pvt) Ltd.</h3>
            <p className="text-primary-foreground/80 mb-4">
              Serving Duty Free customers with excellency since 2001.
            </p>
            <div className="flex gap-4">
              {companyInfo?.social?.facebook && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-primary-foreground hover:text-primary hover:bg-primary-foreground/20 p-2"
                  onClick={() => window.open(companyInfo.social.facebook, '_blank')}
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </Button>
              )}
              {companyInfo?.social?.tiktok && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-primary-foreground hover:text-primary hover:bg-primary-foreground/20 p-2"
                  onClick={() => window.open(companyInfo.social.tiktok, '_blank')}
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21-.51-.15-1.07-.14-1.61.24-1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-primary-foreground hover:text-primary hover:bg-primary-foreground/20 p-2"
                onClick={() => window.open('https://www.instagram.com/metrodfs?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==', '_blank')}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </Button>
            </div>
          </div>

          {/* Duty Free Info */}
          <div>
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Plane className="w-4 h-4" />
              Duty Free Location
            </h4>
            <div className="space-y-2 text-primary-foreground/80">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <div>
                  {companyInfo?.address ? (
                    <p>{companyInfo.address}</p>
                  ) : (
                    <>
                      <p>Terminal 2, Departure Lounge</p>
                      <p>International Airport</p>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <p>{companyInfo?.hours || 'Daily: 5:00 AM - 11:30 PM'}</p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <div className="space-y-2 text-primary-foreground/80">
              {companyInfo?.phones?.map((phone, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {/* Phone clickable */}
                  <a href={`tel:${phone.replace(/[^+\d]/g, '')}`} className="hover:underline">{phone}</a>
                </div>
              ))}
              {companyInfo?.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <a href={`mailto:${companyInfo.email}`} className="hover:underline">{companyInfo.email}</a>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <p>24/7 Customer Support</p>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-primary-foreground/20" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-primary-foreground/60 text-sm">
            © 2025 Metro International. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Button 
              variant="link" 
              size="sm" 
              className="text-primary-foreground/60 hover:text-primary-foreground p-0"
              onClick={() => navigate('/privacy-policy')}
            >
              Privacy Policy
            </Button>
            <Button 
              variant="link" 
              size="sm" 
              className="text-primary-foreground/60 hover:text-primary-foreground p-0"
              onClick={() => navigate('/terms-of-use')}
            >
              Terms of Use
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};
