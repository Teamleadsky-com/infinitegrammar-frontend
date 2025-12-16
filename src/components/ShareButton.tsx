import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Facebook, Linkedin, MessageCircle, Check, Link as LinkIcon } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface ShareButtonProps {
  url: string;
  title: string;
  description?: string;
}

export function ShareButton({ url, title, description }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  // Check if Web Share API is available
  const canShare = typeof navigator !== 'undefined' && navigator.share;

  const handleNativeShare = async () => {
    if (canShare) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        });
        setOpen(false);
      } catch (err) {
        // User cancelled or error occurred
        console.log('Share cancelled or failed');
      }
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setOpen(false);
      }, 1500);
    } catch (err) {
      console.error('Failed to copy link');
    }
  };

  const handleShareClick = (platform: string) => {
    const shareLinks = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
    };

    window.open(shareLinks[platform as keyof typeof shareLinks], '_blank', 'noopener,noreferrer');
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Share2 className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2" align="end">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-medium text-muted-foreground mb-1 px-2">Teilen</p>

          {/* Native Share (Mobile) */}
          {canShare && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNativeShare}
              className="justify-start gap-2 h-9"
            >
              <Share2 className="h-4 w-4" />
              Teilen
            </Button>
          )}

          {/* Twitter/X */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleShareClick('twitter')}
            className="justify-start gap-2 h-9"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
              <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
            </svg>
            X (Twitter)
          </Button>

          {/* Facebook */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleShareClick('facebook')}
            className="justify-start gap-2 h-9"
          >
            <Facebook className="h-4 w-4" />
            Facebook
          </Button>

          {/* LinkedIn */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleShareClick('linkedin')}
            className="justify-start gap-2 h-9"
          >
            <Linkedin className="h-4 w-4" />
            LinkedIn
          </Button>

          {/* WhatsApp */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleShareClick('whatsapp')}
            className="justify-start gap-2 h-9"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </Button>

          <div className="border-t my-1" />

          {/* Copy Link */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyLink}
            className="justify-start gap-2 h-9"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-success" />
                Kopiert!
              </>
            ) : (
              <>
                <LinkIcon className="h-4 w-4" />
                Link kopieren
              </>
            )}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
