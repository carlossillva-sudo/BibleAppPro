export interface ShareContent {
  title: string;
  text: string;
  url?: string;
}

export interface SocialPlatform {
  id: string;
  name: string;
  icon: string;
  color: string;
  share: (content: ShareContent) => Promise<void>;
}

const generateVerseShareText = (
  bookName: string,
  chapter: number,
  verse: number,
  text: string
): string => {
  return `"${text}"\n\n${bookName} ${chapter}:${verse}\n\nCompartilhado via BibleAppPro 📖`;
};

const generateProgressShareText = (chaptersRead: number, streak: number, level: string): string => {
  return `Estou lendo a Bíblia! 📖\n\n📊 Progresso:\n- Capítulos lidos: ${chaptersRead}\n- Sequência: ${streak} dias\n- Nível: ${level}\n\nJunte-se a mim na BibleAppPro!`;
};

const generatePlanShareText = (planName: string, progress: number, totalDays: number): string => {
  return `Estou fazendo o plano "${planName}"! 📅\n\nProgresso: ${Math.round(progress)}% (${totalDays} dias)\n\nParticipe também na BibleAppPro!`;
};

class ShareService {
  private async nativeShare(content: ShareContent): Promise<boolean> {
    if (navigator.share) {
      try {
        await navigator.share(content);
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }

  private copyToClipboard(text: string): Promise<boolean> {
    return navigator.clipboard
      .writeText(text)
      .then(() => true)
      .catch(() => false);
  }

  async shareVerse(
    bookName: string,
    chapter: number,
    verse: number,
    text: string
  ): Promise<{ success: boolean; method: string }> {
    const content: ShareContent = {
      title: `${bookName} ${chapter}:${verse}`,
      text: generateVerseShareText(bookName, chapter, verse, text),
    };

    const nativeSuccess = await this.nativeShare(content);
    if (nativeSuccess) {
      return { success: true, method: 'native' };
    }

    const clipboardSuccess = await this.copyToClipboard(content.text);
    if (clipboardSuccess) {
      return { success: true, method: 'clipboard' };
    }

    return { success: false, method: 'none' };
  }

  async shareProgress(
    chaptersRead: number,
    streak: number,
    level: string
  ): Promise<{ success: boolean; method: string }> {
    const content: ShareContent = {
      title: 'Meu Progresso na BibleAppPro',
      text: generateProgressShareText(chaptersRead, streak, level),
    };

    const nativeSuccess = await this.nativeShare(content);
    if (nativeSuccess) {
      return { success: true, method: 'native' };
    }

    const clipboardSuccess = await this.copyToClipboard(content.text);
    if (clipboardSuccess) {
      return { success: true, method: 'clipboard' };
    }

    return { success: false, method: 'none' };
  }

  async sharePlan(
    planName: string,
    progress: number,
    totalDays: number
  ): Promise<{ success: boolean; method: string }> {
    const content: ShareContent = {
      title: 'Meu Plano de Leitura',
      text: generatePlanShareText(planName, progress, totalDays),
    };

    const nativeSuccess = await this.nativeShare(content);
    if (nativeSuccess) {
      return { success: true, method: 'native' };
    }

    const clipboardSuccess = await this.copyToClipboard(content.text);
    if (clipboardSuccess) {
      return { success: true, method: 'clipboard' };
    }

    return { success: false, method: 'none' };
  }

  async shareToWhatsApp(text: string): Promise<void> {
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
  }

  async shareToTelegram(text: string): Promise<void> {
    const encodedText = encodeURIComponent(text);
    window.open(`https://t.me/share/url?url=${encodedText}`, '_blank');
  }

  async shareToTwitter(text: string): Promise<void> {
    const encodedText = encodeURIComponent(text);
    window.open(`https://twitter.com/intent/tweet?text=${encodedText}`, '_blank');
  }

  async shareToFacebook(text: string): Promise<void> {
    const encodedText = encodeURIComponent(text);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedText}`, '_blank');
  }

  getAvailablePlatforms(): SocialPlatform[] {
    return [
      {
        id: 'whatsapp',
        name: 'WhatsApp',
        icon: 'MessageCircle',
        color: '#25D366',
        share: async (content) => {
          await this.shareToWhatsApp(content.text);
        },
      },
      {
        id: 'telegram',
        name: 'Telegram',
        icon: 'Send',
        color: '#0088CC',
        share: async (content) => {
          await this.shareToTelegram(content.text);
        },
      },
      {
        id: 'twitter',
        name: 'X/Twitter',
        icon: 'Twitter',
        color: '#000000',
        share: async (content) => {
          await this.shareToTwitter(content.text);
        },
      },
      {
        id: 'facebook',
        name: 'Facebook',
        icon: 'Facebook',
        color: '#1877F2',
        share: async (content) => {
          await this.shareToFacebook(content.text);
        },
      },
    ];
  }
}

export const shareService = new ShareService();
