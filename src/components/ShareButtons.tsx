import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Share2, Facebook, Linkedin, MessageCircle, Check, Link as LinkIcon } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
}

export function ShareButtons({ url, title, description }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [showNativeShare, setShowNativeShare] = useState(false);

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
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link');
    }
  };

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
  };

  return (
    <Card className="p-4 bg-muted/30">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Share2 className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Teilen:</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <TooltipProvider>
            {/* Native Share (Mobile) */}
            {canShare && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNativeShare}
                    className="gap-2"
                  >
                    <Share2 className="h-4 w-4" />
                    Teilen
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Teilen</p>
                </TooltipContent>
              </Tooltip>
            )}

            {/* Twitter/X */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => window.open(shareLinks.twitter, '_blank', 'noopener,noreferrer')}
                  className="h-9 w-9"
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
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Auf X teilen</p>
              </TooltipContent>
            </Tooltip>

            {/* Facebook */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => window.open(shareLinks.facebook, '_blank', 'noopener,noreferrer')}
                  className="h-9 w-9"
                >
                  <Facebook className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Auf Facebook teilen</p>
              </TooltipContent>
            </Tooltip>

            {/* LinkedIn */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => window.open(shareLinks.linkedin, '_blank', 'noopener,noreferrer')}
                  className="h-9 w-9"
                >
                  <Linkedin className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Auf LinkedIn teilen</p>
              </TooltipContent>
            </Tooltip>

            {/* WhatsApp */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => window.open(shareLinks.whatsapp, '_blank', 'noopener,noreferrer')}
                  className="h-9 w-9"
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Über WhatsApp teilen</p>
              </TooltipContent>
            </Tooltip>

            {/* Copy Link */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyLink}
                  className="h-9 w-9"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-success" />
                  ) : (
                    <LinkIcon className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{copied ? 'Link kopiert!' : 'Link kopieren'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </Card>
  );
}
