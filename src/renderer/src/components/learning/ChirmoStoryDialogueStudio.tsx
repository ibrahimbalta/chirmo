import React, { useState } from 'react';
import {
  BookOpen,
  Volume2,
  Mic,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Star,
  Flame,
  Award,
  Play,
  Check,
  ChevronRight,
  Smile,
  Compass,
  MessageSquare
} from 'lucide-react';
import { LearningStorageService } from '../../services/learningStorage';
import { TargetLanguageService, SupportedLanguage } from '../../services/targetLanguageService';

export interface DialogueExchange {
  id: string;
  speaker: 'npc' | 'user';
  speakerName: string;
  avatar: string;
  fullEn: string;
  fullTr: string;
  // Boşluk doldurma alanları
  blankTemplateEn?: string; // örn: "Excuse me, I am looking for [BLANK1]. Can you [BLANK2] me?"
  blanks?: {
    id: string;
    correctWord: string;
    options: string[];
  }[];
  explanationTr?: string;
}

export interface StoryAdventure {
  id: string;
  titleEn: string;
  titleTr: string;
  tag: string;
  level: string;
  emoji: string;
  bgGradient: string;
  synopsisTr: string;
  exchanges: DialogueExchange[];
}

export interface ChirmoStoryDialogueStudioProps {
  onBackToHome?: () => void;
}

export const ChirmoStoryDialogueStudio: React.FC<ChirmoStoryDialogueStudioProps> = ({
  onBackToHome
}) => {
  // ==================== ZENGİN HİKAYELER LİSTESİ ====================
  const STORIES: StoryAdventure[] = [
    {
      id: 'story-cafe',
      titleEn: 'The Mysterious Cafe in London',
      titleTr: 'Londra\'da Gizemli Kafe',
      tag: 'Gizem & Günlük Konuşma',
      level: 'A1 - A2 Başlangıç',
      emoji: '☕ 🕵️',
      bgGradient: 'from-amber-600 via-orange-600 to-rose-600',
      synopsisTr: 'Londra\'da yağmurlu bir akşam. Sıcak bir fincan kahve içmek ve haritadaki gizemli sokağı bulmak için kafeye giriyorsun.',
      exchanges: [
        {
          id: 'ex-1',
          speaker: 'npc',
          speakerName: 'Barista Oliver',
          avatar: '👨‍🍳',
          fullEn: 'Good evening! Welcome to Baker Street Cafe. How can I help you today?',
          fullTr: 'İyi akşamlar! Baker Street Kafe\'ye hoş geldiniz. Bugün size nasıl yardımcı olabilirim?',
          explanationTr: 'Kafelerde garsonlar her zaman bu nazik karşılama kalıbıyla söze başlar.'
        },
        {
          id: 'ex-2',
          speaker: 'user',
          speakerName: 'Sen (Kahraman)',
          avatar: '🧑',
          fullEn: 'Good evening! I want a cup of hot coffee, please.',
          fullTr: 'İyi akşamlar! Bir fincan sıcak kahve istiyorum lütfen.',
          blankTemplateEn: 'Good evening! I [BLANK1] a cup of hot coffee, [BLANK2].',
          blanks: [
            { id: 'b1', correctWord: 'want', options: ['want', 'am', 'like'] },
            { id: 'b2', correctWord: 'please', options: ['please', 'now', 'hello'] }
          ],
          explanationTr: '"I want..." kalıbı istek bildirmek için en temel yapıdır; cümlenin sonuna "please" eklemek ise İngiliz kültüründe vazgeçilmez nezakettir.'
        },
        {
          id: 'ex-3',
          speaker: 'npc',
          speakerName: 'Barista Oliver',
          avatar: '👨‍🍳',
          fullEn: 'Certainly! With milk or black? And would you like something to eat?',
          fullTr: 'Kesinlikle! Sütlü mü yoksa sade mi? Yanında yiyecek bir şey ister misiniz?',
          explanationTr: '"With milk or black?" sorusu kahve siparişlerinde en sık duyacağın sorudur.'
        },
        {
          id: 'ex-4',
          speaker: 'user',
          speakerName: 'Sen (Kahraman)',
          avatar: '🧑',
          fullEn: 'Black coffee, please. Also, where is the nearest museum?',
          fullTr: 'Sade kahve lütfen. Ayrıca, en yakın müze nerede?',
          blankTemplateEn: 'Black coffee, please. Also, [BLANK1] is the nearest museum?',
          blanks: [
            { id: 'b1', correctWord: 'where', options: ['where', 'what', 'who'] }
          ],
          explanationTr: 'Bir yerin konumunu sormak için her zaman "Where is...?" kalıbı kullanılır.'
        },
        {
          id: 'ex-5',
          speaker: 'npc',
          speakerName: 'Barista Oliver',
          avatar: '👨‍🍳',
          fullEn: 'The Sherlock Holmes Museum is just around the corner, two minutes on foot!',
          fullTr: 'Sherlock Holmes Müzesi hemen köşeyi dönünce, yürüyerek sadece iki dakika!',
          explanationTr: '"Just around the corner" İngilizcede "hemen köşede / çok yakın" anlamına gelen harika bir deyimdir.'
        },
        {
          id: 'ex-6',
          speaker: 'user',
          speakerName: 'Sen (Kahraman)',
          avatar: '🧑',
          fullEn: 'Thank you very much for your help! Have a wonderful evening!',
          fullTr: 'Yardımınız için çok teşekkür ederim! Harika bir akşam dilerim!',
          blankTemplateEn: 'Thank you very much [BLANK1] your help! Have a wonderful evening!',
          blanks: [
            { id: 'b1', correctWord: 'for', options: ['for', 'to', 'with'] }
          ],
          explanationTr: '"Thank you for your help" (Yardımın için teşekkürler) kalıbında her zaman "for" edatı kullanılır.'
        }
      ]
    },
    {
      id: 'story-airport',
      titleEn: 'Lost Luggage at Heathrow Airport',
      titleTr: 'Heathrow\'da Kayıp Valiz',
      tag: 'Seyahat & Macera',
      level: 'A2 Günlük Yaşam',
      emoji: '✈️ 🧳',
      bgGradient: 'from-blue-600 via-indigo-600 to-purple-600',
      synopsisTr: 'Uçaktan indin ancak bantta valizin görünmüyor! Kayıp eşya ofisindeki memurla görüşüp valizini bulmalısın.',
      exchanges: [
        {
          id: 'air-1',
          speaker: 'npc',
          speakerName: 'Officer Sarah',
          avatar: '👮‍♀️',
          fullEn: 'Hello! This is Heathrow Lost Baggage Office. Can I help you?',
          fullTr: 'Merhaba! Burası Heathrow Kayıp Bagaj Ofisi. Size yardımcı olabilir miyim?',
          explanationTr: 'Havalimanı görevlileri sorunları dinlemek için "Can I help you?" kalıbını kullanır.'
        },
        {
          id: 'air-2',
          speaker: 'user',
          speakerName: 'Sen (Yolcu)',
          avatar: '🧑',
          fullEn: 'Hello! I have a problem. I cannot find my luggage.',
          fullTr: 'Merhaba! Bir problemim var. Bagajımı bulamıyorum.',
          blankTemplateEn: 'Hello! I [BLANK1] a problem. I [BLANK2] find my luggage.',
          blanks: [
            { id: 'b1', correctWord: 'have', options: ['have', 'do', 'am'] },
            { id: 'b2', correctWord: 'cannot', options: ['cannot', 'not', 'no'] }
          ],
          explanationTr: 'Sorun bildirirken "I have a problem" ve yapamadığımız durumlarda "I cannot / can\'t" kalıbı kurtarıcındır.'
        },
        {
          id: 'air-3',
          speaker: 'npc',
          speakerName: 'Officer Sarah',
          avatar: '👮‍♀️',
          fullEn: 'Do not worry! What color is your suitcase, and do you have your flight ticket?',
          fullTr: 'Endişelenmeyin! Valiziniz ne renk ve uçuş biletiniz yanınızda mı?',
          explanationTr: '"What color is...?" (Ne renktir?) ve "Do you have...?" (Sahip misiniz?) soru kalıplarıdır.'
        },
        {
          id: 'air-4',
          speaker: 'user',
          speakerName: 'Sen (Yolcu)',
          avatar: '🧑',
          fullEn: 'It is a large blue suitcase. Yes, here is my ticket.',
          fullTr: 'Büyük mavi bir bavul. Evet, işte bilet burada.',
          blankTemplateEn: 'It [BLANK1] a large blue suitcase. Yes, here [BLANK2] my ticket.',
          blanks: [
            { id: 'b1', correctWord: 'is', options: ['is', 'are', 'have'] },
            { id: 'b2', correctWord: 'is', options: ['is', 'are', 'was'] }
          ],
          explanationTr: 'Tekil nesneleri tanımlarken "It is..." ve bir şeyi uzatırken "Here is..." kalıbı kullanılır.'
        },
        {
          id: 'air-5',
          speaker: 'npc',
          speakerName: 'Officer Sarah',
          avatar: '👮‍♀️',
          fullEn: 'Great news! Your bag is on its way from terminal 2. It will arrive in ten minutes!',
          fullTr: 'Harika haber! Çantanız 2. terminalden geliyor. On dakika içinde burada olacak!',
          explanationTr: 'Gelecek zaman için "It will arrive..." (Gelecek/varacak) kalıbı kullanılır.'
        }
      ]
    },
    {
      id: 'story-kids-dino',
      titleEn: 'Kids: The Friendly Little Dinosaur',
      titleTr: 'Çocuklar: Sevimli Dinozorun Orman Macerası',
      tag: 'Çocuk & Eğlence',
      level: 'Kids / Pre-A1',
      emoji: '🦖 🌳',
      bgGradient: 'from-emerald-600 via-teal-600 to-green-600',
      synopsisTr: 'Ormanda kaybolan sevimli minik dinozor Dobby ile tanışıyorsun! Onun karnı çok aç ve evini arıyor.',
      exchanges: [
        {
          id: 'kd-1',
          speaker: 'npc',
          speakerName: 'Dino Dobby',
          avatar: '🦖',
          fullEn: 'Hello friend! I am Dobby. I love bananas! Are you friendly?',
          fullTr: 'Merhaba arkadaşım! Ben Dobby. Muzları çok severim! Sen dost musun?',
          explanationTr: 'Çocuklar kendini tanıtırken "I am..." ve sevdiklerini anlatırken "I love..." der.'
        },
        {
          id: 'kd-2',
          speaker: 'user',
          speakerName: 'Sen (Kahraman Çocuk)',
          avatar: '🧒',
          fullEn: 'Yes! I am your friend. I like green dinosaurs!',
          fullTr: 'Evet! Ben senin arkadaşınım. Yeşil dinozorları severim!',
          blankTemplateEn: 'Yes! I [BLANK1] your friend. I [BLANK2] green dinosaurs!',
          blanks: [
            { id: 'b1', correctWord: 'am', options: ['am', 'have', 'is'] },
            { id: 'b2', correctWord: 'like', options: ['like', 'sleep', 'go'] }
          ],
          explanationTr: '"I am your friend" (Ben senin arkadaşınım) ve "I like..." (Severim) kalıbı.'
        },
        {
          id: 'kd-3',
          speaker: 'npc',
          speakerName: 'Dino Dobby',
          avatar: '🦖',
          fullEn: 'Yay! Can we play together in the playground?',
          fullTr: 'Yaşasın! Oyun parkında birlikte oynayabilir miyiz?',
          explanationTr: '"Can we...?" birlikte bir şey yapmayı teklif ederken kullanılır.'
        },
        {
          id: 'kd-4',
          speaker: 'user',
          speakerName: 'Sen (Kahraman Çocuk)',
          avatar: '🧒',
          fullEn: 'Yes, we can play with a bouncy ball!',
          fullTr: 'Evet, zıplayan topla oynayabiliriz!',
          blankTemplateEn: 'Yes, we [BLANK1] play with a bouncy ball!',
          blanks: [
            { id: 'b1', correctWord: 'can', options: ['can', 'no', 'are'] }
          ],
          explanationTr: '"We can..." (Yapabiliriz) yapabilirlik ve eğlence kalıbıdır.'
        }
      ]
    },
    {
      id: 'story-hotel',
      titleEn: 'Midnight Check-in at Royal Hotel',
      titleTr: 'Gece Yarısı Otel Girişi & Anahtar',
      tag: 'Otel & Konaklama',
      level: 'A1 - A2 Başlangıç',
      emoji: '🏨 🗝️',
      bgGradient: 'from-purple-700 via-indigo-800 to-slate-900',
      synopsisTr: 'Gece geç saatte Londra\'da otele vardın. Resepsiyonistle görüşüp odana yerleşmeli ve wifi şifresini almalısın.',
      exchanges: [
        {
          id: 'ht-1',
          speaker: 'npc',
          speakerName: 'Receptionist Arthur',
          avatar: '🛎️',
          fullEn: 'Good evening, sir! Welcome to Royal Park Hotel. Do you have a reservation?',
          fullTr: 'İyi akşamlar efendim! Royal Park Otel\'e hoş geldiniz. Rezervasyonunuz var mı?',
          explanationTr: 'Otel girişlerinde ilk soru her zaman "Do you have a reservation?" kalıbıdır.'
        },
        {
          id: 'ht-2',
          speaker: 'user',
          speakerName: 'Sen (Misafir)',
          avatar: '🧑',
          fullEn: 'Good evening! Yes, I have a reservation under the name Ali.',
          fullTr: 'İyi akşamlar! Evet, Ali ismi adına bir rezervasyonum var.',
          blankTemplateEn: 'Good evening! Yes, I [BLANK1] a reservation under the name Ali.',
          blanks: [
            { id: 'b1', correctWord: 'have', options: ['have', 'am', 'want'] }
          ],
          explanationTr: '"I have a reservation" (Rezervasyonum var) kalıbı otellerde anahtar ifadedir.'
        },
        {
          id: 'ht-3',
          speaker: 'npc',
          speakerName: 'Receptionist Arthur',
          avatar: '🛎️',
          fullEn: 'Perfect! Room 304 on the third floor. Here is your key card. Breakfast is at seven.',
          fullTr: 'Harika! Üçüncü katta 304 numaralı oda. İşte anahtar kartınız. Kahvaltı saat yedide.',
          explanationTr: 'Resepsiyonist kat ve oda numarasını söylerken "Here is your key" der.'
        },
        {
          id: 'ht-4',
          speaker: 'user',
          speakerName: 'Sen (Misafir)',
          avatar: '🧑',
          fullEn: 'Thank you! What is the wifi password, please?',
          fullTr: 'Teşekkür ederim! Wifi şifresi nedir lütfen?',
          blankTemplateEn: 'Thank you! [BLANK1] is the wifi password, please?',
          blanks: [
            { id: 'b1', correctWord: 'What', options: ['What', 'Where', 'Who'] }
          ],
          explanationTr: 'Bilgi veya şifre sorarken "What is...?" kalıbı kullanılır.'
        }
      ]
    },
    {
      id: 'story-pharmacy',
      titleEn: 'Emergency at the Local Pharmacy',
      titleTr: 'Eczanede Baş Ağrısı & İlaç Arayışı',
      tag: 'Sağlık & Eczane',
      level: 'A2 Günlük Yaşam',
      emoji: '💊 🏥',
      bgGradient: 'from-teal-600 via-emerald-700 to-cyan-800',
      synopsisTr: 'Yolculuk sırasında şiddetli bir baş ağrısı başladı. Yerel bir eczaneye girip derdini anlatmalı ve uygun ilacı istemelisin.',
      exchanges: [
        {
          id: 'ph-1',
          speaker: 'npc',
          speakerName: 'Pharmacist Emma',
          avatar: '👩‍⚕️',
          fullEn: 'Hello! How can I help you today? Are you feeling unwell?',
          fullTr: 'Merhaba! Bugün size nasıl yardımcı olabilirim? Kendinizi iyi hissetmiyor musunuz?',
          explanationTr: 'Eczacılar şikayeti öğrenmek için "Are you feeling unwell?" diye sorabilir.'
        },
        {
          id: 'ph-2',
          speaker: 'user',
          speakerName: 'Sen (Hasta)',
          avatar: '🧑',
          fullEn: 'I have a terrible headache. Do you have medicine for pain?',
          fullTr: 'Korkunç bir baş ağrım var. Ağrı için ilacınız var mı?',
          blankTemplateEn: 'I [BLANK1] a terrible headache. Do you [BLANK2] medicine for pain?',
          blanks: [
            { id: 'b1', correctWord: 'have', options: ['have', 'am', 'is'] },
            { id: 'b2', correctWord: 'have', options: ['have', 'need', 'like'] }
          ],
          explanationTr: 'Ağrı veya hastalık bildiriminde "I have a headache / stomachache" kalıbı kullanılır.'
        },
        {
          id: 'ph-3',
          speaker: 'npc',
          speakerName: 'Pharmacist Emma',
          avatar: '👩‍⚕️',
          fullEn: 'Yes, take this painkiller with a glass of water. It will help within twenty minutes.',
          fullTr: 'Evet, bu ağrı kesiciyi bir bardak suyla için. Yirmi dakika içinde fayda edecektir.',
          explanationTr: '"Take this painkiller" (bu ağrı kesiciyi alın) tıbbi tavsiye kalıbıdır.'
        },
        {
          id: 'ph-4',
          speaker: 'user',
          speakerName: 'Sen (Hasta)',
          avatar: '🧑',
          fullEn: 'Thank you very much! How much is it?',
          fullTr: 'Çok teşekkür ederim! Fiyatı ne kadar?',
          blankTemplateEn: 'Thank you very much! [BLANK1] is it?',
          blanks: [
            { id: 'b1', correctWord: 'How much', options: ['How much', 'How many', 'Where'] }
          ],
          explanationTr: 'Fiyat sorarken daima "How much is it?" kalıbı kullanılır.'
        }
      ]
    }
  ];


  const GERMAN_STORIES: StoryAdventure[] = [
    {
      id: 'de-story-cafe',
      titleEn: 'Das geheimnisvolle Café in Berlin',
      titleTr: 'Berlin\'de Gizemli Kafe',
      tag: 'Gizem & Günlük Konuşma',
      level: 'A1 - A2 Başlangıç',
      emoji: '☕ 🕵️',
      bgGradient: 'from-amber-600 via-orange-600 to-rose-600',
      synopsisTr: 'Berlin\'de yağmurlu bir akşam. Sıcak bir fincan kahve içmek ve müzeyi bulmak için kafeye giriyorsun.',
      exchanges: [
        {
          id: 'de-c1',
          speaker: 'npc',
          speakerName: 'Lukas (Kellner)',
          avatar: '☕',
          fullEn: 'Guten Abend! Willkommen im Café Berlin. Was darf ich Ihnen bringen?',
          fullTr: 'İyi akşamlar! Café Berlin\'e hoş geldiniz. Size ne getirebilirim?',
          explanationTr: 'Almanya\'da garsonlar "Was darf ich Ihnen bringen?" ile çok kibar şekilde sipariş sorar.'
        },
        {
          id: 'de-c2',
          speaker: 'user',
          speakerName: 'Sen',
          avatar: '🧑',
          fullEn: 'Guten Abend! Ich möchte bitte einen warmen Cappuccino bestellen.',
          fullTr: 'İyi akşamlar! Sıcak bir kapuçino sipariş etmek istiyorum lütfen.',
          blankTemplateEn: 'Guten Abend! Ich [BLANK1] bitte einen warmen Cappuccino [BLANK2].',
          blanks: [
            { id: 'b1', correctWord: 'möchte', options: ['möchte', 'gehe', 'habe'] },
            { id: 'b2', correctWord: 'bestellen', options: ['bestellen', 'kaufen', 'sehen'] }
          ],
          explanationTr: '"Ich möchte ... bestellen" kalıbı en doğal sipariş verme kalıbıdır.'
        },
        {
          id: 'de-c3',
          speaker: 'npc',
          speakerName: 'Lukas (Kellner)',
          avatar: '☕',
          fullEn: 'Sehr gerne! Mit Hafermilch oder normaler Milch? Möchten Sie auch etwas essen?',
          fullTr: 'Memnuniyetle! Yulaf sütüyle mi yoksa normal sütle mi? Yanında bir şey yemek ister misiniz?',
          explanationTr: '"Mit Hafermilch oder normaler Milch?" kafelerde sıkça duyacağın sorudur.'
        },
        {
          id: 'de-c4',
          speaker: 'user',
          speakerName: 'Sen',
          avatar: '🧑',
          fullEn: 'Mit Hafermilch bitte. Und wo ist das nächste Museum?',
          fullTr: 'Yulaf sütlü lütfen. Ve en yakın müze nerede?',
          blankTemplateEn: 'Mit Hafermilch bitte. Und wo [BLANK1] das nächste [BLANK2]?',
          blanks: [
            { id: 'b1', correctWord: 'ist', options: ['ist', 'sind', 'hat'] },
            { id: 'b2', correctWord: 'Museum', options: ['Museum', 'Auto', 'Zimmer'] }
          ],
          explanationTr: '"Wo ist das nächste...?" yön tariflerinde en temel ve pratik kalıptır.'
        },
        {
          id: 'de-c5',
          speaker: 'npc',
          speakerName: 'Lukas (Kellner)',
          avatar: '☕',
          fullEn: 'Das Museum ist direkt um die Ecke, nur zwei Minuten zu Fuß!',
          fullTr: 'Müze hemen köşeyi dönünce, yürüyerek sadece iki dakika!',
          explanationTr: '"Direkt um die Ecke" hemen köşede çok yakın anlamına gelir.'
        },
        {
          id: 'de-c6',
          speaker: 'user',
          speakerName: 'Sen',
          avatar: '🧑',
          fullEn: 'Vielen Dank für Ihre Hilfe! Einen schönen Abend noch!',
          fullTr: 'Yardımınız için çok teşekkür ederim! İyi akşamlar dilerim!',
          blankTemplateEn: 'Vielen [BLANK1] für Ihre Hilfe! Einen schönen [BLANK2] noch!',
          blanks: [
            { id: 'b1', correctWord: 'Dank', options: ['Dank', 'Tag', 'Gruß'] },
            { id: 'b2', correctWord: 'Abend', options: ['Abend', 'Morgen', 'Kaffee'] }
          ],
          explanationTr: '"Einen schönen Abend noch!" Almanya\'da veda ederken en yaygın nezaket cümlesidir.'
        }
      ]
    },
    {
      id: 'de-story-hotel',
      titleEn: 'Check-in im Hotel München',
      titleTr: 'Münih Otelinde Giriş (Check-in)',
      tag: 'Seyahat & Otel',
      level: 'A2 - B1 Temel',
      emoji: '🏨 🛎️',
      bgGradient: 'from-blue-600 via-indigo-600 to-purple-600',
      synopsisTr: 'Münih\'te rezervasyon yaptırdığın otele vardın. Resepsiyondaki görevliyle konuşup anahtar kartını almalısın.',
      exchanges: [
        {
          id: 'de-h1',
          speaker: 'npc',
          speakerName: 'Frau Weber (Rezeptionistin)',
          avatar: '🛎️',
          fullEn: 'Guten Abend! Herzlich willkommen im Hotel München. Haben Sie eine Reservierung?',
          fullTr: 'İyi akşamlar! Hotel München\'e hoş geldiniz. Rezervasyonunuz var mı?',
          explanationTr: 'Otel girişlerinde ilk soru her zaman "Haben Sie eine Reservierung?" olur.'
        },
        {
          id: 'de-h2',
          speaker: 'user',
          speakerName: 'Sen',
          avatar: '🧑',
          fullEn: 'Guten Abend! Ja, ich habe eine Reservierung auf den Namen Ali.',
          fullTr: 'İyi akşamlar! Evet, Ali ismi üzerine rezervasyonum var.',
          blankTemplateEn: 'Guten Abend! Ja, ich [BLANK1] eine Reservierung auf den [BLANK2] Ali.',
          blanks: [
            { id: 'b1', correctWord: 'habe', options: ['habe', 'bin', 'gehe'] },
            { id: 'b2', correctWord: 'Namen', options: ['Namen', 'Pass', 'Zug'] }
          ],
          explanationTr: '"Ich habe eine Reservierung auf den Namen..." kalıbı otellerde anahtar ifadedir.'
        },
        {
          id: 'de-h3',
          speaker: 'npc',
          speakerName: 'Frau Weber',
          avatar: '🛎️',
          fullEn: 'Wunderbar! Zimmer 304 im dritten Stock. Hier ist Ihre Schlüsselkarte. Das Frühstück ist um sieben Uhr.',
          fullTr: 'Harika! Üçüncü katta 304 numaralı oda. İşte anahtar kartınız. Kahvaltı saat yedide.',
          explanationTr: 'Resepsiyonist kat ve oda numarasını söylerken "Hier ist Ihre Schlüsselkarte" der.'
        },
        {
          id: 'de-h4',
          speaker: 'user',
          speakerName: 'Sen',
          avatar: '🧑',
          fullEn: 'Vielen Dank! Wie lautet das WLAN-Passwort bitte?',
          fullTr: 'Teşekkür ederim! Wifi şifresi nedir lütfen?',
          blankTemplateEn: 'Vielen Dank! Wie lautet das [BLANK1] bitte?',
          blanks: [
            { id: 'b1', correctWord: 'WLAN-Passwort', options: ['WLAN-Passwort', 'Zimmer', 'Frühstück'] }
          ],
          explanationTr: '"Wie lautet das WLAN-Passwort?" otelde veya kafede şifre sormanın en nazik yoludur.'
        }
      ]
    }
  ];

  const FRENCH_STORIES: StoryAdventure[] = [
    {
      id: 'fr-story-cafe',
      titleEn: 'Le Café Mystérieux à Paris',
      titleTr: 'Paris\'te Gizemli Kafe',
      tag: 'Gizem & Günlük Konuşma',
      level: 'A1 - A2 Başlangıç',
      emoji: '☕ 🥐',
      bgGradient: 'from-amber-600 via-orange-600 to-rose-600',
      synopsisTr: 'Paris\'te yağmurlu bir akşam. Sıcak bir fincan kahve içmek ve müzeyi bulmak için kafeye giriyorsun.',
      exchanges: [
        {
          id: 'fr-c1',
          speaker: 'npc',
          speakerName: 'Pierre (Serveur)',
          avatar: '☕',
          fullEn: 'Bonsoir ! Bienvenue au Café Parisien. Que puis-je vous servir ?',
          fullTr: 'İyi akşamlar! Café Parisien\'e hoş geldiniz. Size ne ikram edebilirim?',
          explanationTr: 'Fransız kafelerinde garsonlar "Que puis-je vous servir ?" ile söze başlar.'
        },
        {
          id: 'fr-c2',
          speaker: 'user',
          speakerName: 'Sen',
          avatar: '🧑',
          fullEn: 'Bonsoir ! Je voudrais un café au lait et un croissant, s\'il vous plaît.',
          fullTr: 'İyi akşamlar! Sütlü bir kahve ve kruvasan rica ediyorum, lütfen.',
          blankTemplateEn: 'Bonsoir ! Je [BLANK1] un café au lait et un [BLANK2], s\'il vous plaît.',
          blanks: [
            { id: 'b1', correctWord: 'voudrais', options: ['voudrais', 'peux', 'vais'] },
            { id: 'b2', correctWord: 'croissant', options: ['croissant', 'livre', 'train'] }
          ],
          explanationTr: '"Je voudrais..." kalıbı Fransa\'da en kibar istek ifadesidir.'
        },
        {
          id: 'fr-c3',
          speaker: 'npc',
          speakerName: 'Pierre (Serveur)',
          avatar: '☕',
          fullEn: 'Très bien ! Avec plaisir. Souhaitez-vous autre chose ?',
          fullTr: 'Çok iyi! Memnuniyetle. Başka bir şey arzu eder misiniz?',
          explanationTr: '"Souhaitez-vous autre chose ?" başka bir şey ister misiniz demektir.'
        },
        {
          id: 'fr-c4',
          speaker: 'user',
          speakerName: 'Sen',
          avatar: '🧑',
          fullEn: 'Non merci. Où se trouve le musée le plus proche, s\'il vous plaît ?',
          fullTr: 'Hayır teşekkürler. En yakın müze nerede bulunuyor lütfen?',
          blankTemplateEn: 'Non merci. Où se [BLANK1] le [BLANK2] le plus proche, s\'il vous plaît ?',
          blanks: [
            { id: 'b1', correctWord: 'trouve', options: ['trouve', 'mange', 'parle'] },
            { id: 'b2', correctWord: 'musée', options: ['musée', 'pain', 'soleil'] }
          ],
          explanationTr: '"Où se trouve... ?" yön sorarken en kibar Fransızca yapıdır.'
        },
        {
          id: 'fr-c5',
          speaker: 'npc',
          speakerName: 'Pierre (Serveur)',
          avatar: '☕',
          fullEn: 'Le musée est juste au coin de la rue, à deux minutes à pied !',
          fullTr: 'Müze hemen köşeyi dönünce, yürüyerek iki dakika!',
          explanationTr: '"À deux minutes à pied" yürüyerek iki dakika uzaklıkta demektir.'
        },
        {
          id: 'fr-c6',
          speaker: 'user',
          speakerName: 'Sen',
          avatar: '🧑',
          fullEn: 'Merci beaucoup pour votre aide ! Passez une excellente soirée !',
          fullTr: 'Yardımınız için çok teşekkür ederim! Harika bir akşam geçirin!',
          blankTemplateEn: 'Merci beaucoup pour votre [BLANK1] ! Passez une excellente [BLANK2] !',
          blanks: [
            { id: 'b1', correctWord: 'aide', options: ['aide', 'table', 'voiture'] },
            { id: 'b2', correctWord: 'soirée', options: ['soirée', 'pomme', 'rue'] }
          ],
          explanationTr: '"Passez une excellente soirée !" çok nazik bir akşam vedasıdır.'
        }
      ]
    }
  ];


  const [targetLang, setTargetLang] = useState<SupportedLanguage>(() =>
    TargetLanguageService.getTargetLanguage()
  );

  const activeStories =
    targetLang === 'de'
      ? GERMAN_STORIES
      : targetLang === 'fr'
        ? FRENCH_STORIES
        : STORIES;

  // Aktif Hikaye ve Adım Durumu
  const [selectedStoryId, setSelectedStoryId] = useState<string>(() => activeStories[0].id);
  const [exchangeIndex, setExchangeIndex] = useState<number>(0);
  const [userBlanks, setUserBlanks] = useState<Record<string, string>>({});
  const [isExchangeComplete, setIsExchangeComplete] = useState<boolean>(false);
  const [storyCompleted, setStoryCompleted] = useState<boolean>(false);
  const [storyStars, setStoryStars] = useState<number>(() => {
    const saved = localStorage.getItem('chirmo_story_stars');
    return saved ? parseInt(saved, 10) : 40;
  });

  useEffect(() => {
    return TargetLanguageService.subscribe((lang) => {
      setTargetLang(lang);
      const newStories = lang === 'de' ? GERMAN_STORIES : lang === 'fr' ? FRENCH_STORIES : STORIES;
      setSelectedStoryId(newStories[0].id);
      setExchangeIndex(0);
      setUserBlanks({});
      setIsExchangeComplete(false);
      setStoryCompleted(false);
    });
  }, []);

  const activeStory = activeStories.find((s) => s.id === selectedStoryId) || activeStories[0];
  const currentExchange = activeStory.exchanges[exchangeIndex];

  const handleSpeak = (text: string) => {
    LearningStorageService.speak(text);
  };

  const handleSelectBlankWord = (blankId: string, word: string) => {
    setUserBlanks((prev) => ({
      ...prev,
      [blankId]: word
    }));
  };

  const handleVerifyExchange = () => {
    if (!currentExchange.blanks) return;

    // Tüm boşluklar doğru mu kontrol et
    const allCorrect = currentExchange.blanks.every(
      (b) => userBlanks[b.id] === b.correctWord
    );

    if (allCorrect) {
      setIsExchangeComplete(true);
      const nextStars = storyStars + 10;
      setStoryStars(nextStars);
      localStorage.setItem('chirmo_story_stars', nextStars.toString());
      handleSpeak(`Awesome! ${currentExchange.fullEn}`);
    } else {
      handleSpeak('Almost there! Try again.');
      alert('Küçük bir hata var, doğru kelimeleri tekrar seçmeyi dene!');
    }
  };

  const handleNextExchange = () => {
    setUserBlanks({});
    setIsExchangeComplete(false);
    if (exchangeIndex + 1 < activeStory.exchanges.length) {
      setExchangeIndex(exchangeIndex + 1);
    } else {
      setStoryCompleted(true);
      const nextStars = storyStars + 25;
      setStoryStars(nextStars);
      localStorage.setItem('chirmo_story_stars', nextStars.toString());
      handleSpeak('Congratulations! You completed this story adventure!');
    }
  };

  const handleRestartStory = (storyId?: string) => {
    if (storyId) setSelectedStoryId(storyId);
    setExchangeIndex(0);
    setUserBlanks({});
    setIsExchangeComplete(false);
    setStoryCompleted(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8fafc] dark:bg-slate-950 overflow-y-auto">
      {/* ÜST AFİŞ */}
      <div className={`bg-gradient-to-r ${activeStory.bgGradient} text-white p-5 sm:p-7 shadow-lg`}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>İnteraktif Rol Yapma & Diyalog Tiyatrosu</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center space-x-2">
              <span>{activeStory.titleTr}</span>
              <span className="text-xl">{activeStory.emoji}</span>
            </h1>
            <p className="text-xs sm:text-sm text-white/90 max-w-xl">
              {activeStory.synopsisTr}
            </p>
          </div>

          <div className="flex items-center space-x-3 self-start sm:self-auto">
            <div className="bg-white/15 backdrop-blur-md border border-white/25 px-4 py-2.5 rounded-2xl flex items-center space-x-2 shadow-xs">
              <Star className="w-5 h-5 text-amber-300 fill-amber-300" />
              <div>
                <div className="text-[10px] uppercase font-bold text-white/80">Hikaye Yıldızları</div>
                <div className="text-base font-black">{storyStars} ⭐</div>
              </div>
            </div>

            {onBackToHome && (
              <button
                type="button"
                onClick={onBackToHome}
                className="px-3.5 py-2.5 rounded-2xl bg-white text-slate-900 font-black text-xs hover:bg-slate-100 transition-all cursor-pointer shadow-sm"
              >
                ← Ana Sayfa
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-5 space-y-6">
        {/* HİKAYE SEÇİCİ KARTLARI */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {activeStories.map((story) => {
            const isSelected = story.id === selectedStoryId;
            return (
              <button
                key={story.id}
                type="button"
                onClick={() => handleRestartStory(story.id)}
                className={`p-4 rounded-3xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white dark:bg-slate-900 border-indigo-500 shadow-md ring-2 ring-indigo-400 scale-102'
                    : 'bg-white/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{story.emoji}</span>
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    {story.level}
                  </span>
                </div>
                <div className="mt-2">
                  <div className="text-sm font-black text-slate-900 dark:text-white">
                    {story.titleTr}
                  </div>
                  <div className="text-[11px] text-slate-500 font-bold">
                    {story.titleEn}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* ==================== HİKAYE TAMAMLANDI EKRANI ==================== */}
        {storyCompleted ? (
          <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border-2 border-emerald-400 shadow-xl text-center space-y-4 animate-fade-in">
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center text-4xl shadow-md animate-bounce">
              🏆
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Tebrikler! Hikaye Başarıyla Tamamlandı!
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
              "{activeStory.titleTr}" macerasındaki tüm karşılıklı diyalogları tamamladın ve gerçek hayat İngilizcesini sesli konuştun!
            </p>
            <div className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 font-black text-sm">
              <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
              <span>+35 Ekstra Hikaye Yıldızı Kazandın! ⭐</span>
            </div>
            <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => handleRestartStory()}
                className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              >
                Bu Hikayeyi Tekrar Canlandır 🔄
              </button>
            </div>
          </div>
        ) : (
          /* ==================== AKTİF DİYALOG KARTI ==================== */
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            {/* İlerleme Çubuğu */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black uppercase text-indigo-600 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-1 rounded-full">
                  Diyalog Adımı: {exchangeIndex + 1} / {activeStory.exchanges.length}
                </span>
              </div>
              <div className="text-xs font-bold text-slate-400">
                {currentExchange.speaker === 'npc' ? '🎙️ Karşı Taraf Konuşuyor' : '✍️ Sıra Sende: Boşluğu Doldur'}
              </div>
            </div>

            {/* DİYALOG SAHNESİ */}
            <div className="space-y-4">
              {/* Önceki diyalog geçmişi (bağlamı görmek için) */}
              {exchangeIndex > 0 && (
                <div className="space-y-2 opacity-60">
                  <div className="text-[11px] font-black uppercase text-slate-400">Önceki Konuşma:</div>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-600 dark:text-slate-300">
                    "{activeStory.exchanges[exchangeIndex - 1].fullEn}" ({activeStory.exchanges[exchangeIndex - 1].fullTr})
                  </div>
                </div>
              )}

              {/* MEVCUT ADIM: NPC İSE */}
              {currentExchange.speaker === 'npc' && (
                <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-50/70 to-purple-50/50 dark:from-slate-800/80 dark:to-slate-800/40 border border-indigo-100 dark:border-slate-700 space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-2xl shadow-xs">
                      {currentExchange.avatar}
                    </div>
                    <div>
                      <div className="text-xs font-black text-indigo-600">{currentExchange.speakerName}</div>
                      <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                        "{currentExchange.fullEn}"
                      </div>
                      <div className="text-xs sm:text-sm text-slate-500 font-medium">
                        {currentExchange.fullTr}
                      </div>
                    </div>
                  </div>

                  {currentExchange.explanationTr && (
                    <div className="p-3 rounded-2xl bg-white/80 dark:bg-slate-900/80 text-xs text-indigo-950 dark:text-indigo-200 border border-indigo-100 dark:border-slate-700">
                      <span className="font-black">💡 Püf Noktası: </span>
                      {currentExchange.explanationTr}
                    </div>
                  )}

                  <div className="flex items-center space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={() => handleSpeak(currentExchange.fullEn)}
                      className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center space-x-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>Sesli Dinle</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleNextExchange}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs flex items-center space-x-1.5 transition-all cursor-pointer shadow-md active:scale-95"
                    >
                      <span>Cevap Vermeye Geç →</span>
                    </button>
                  </div>
                </div>
              )}

              {/* MEVCUT ADIM: KULLANICI (BOŞLUK DOLDURMA) */}
              {currentExchange.speaker === 'user' && (
                <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-50/70 to-rose-50/50 dark:from-slate-800/80 dark:to-slate-800/40 border border-amber-200 dark:border-slate-700 space-y-5">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-2xl shadow-xs">
                      {currentExchange.avatar}
                    </div>
                    <div>
                      <div className="text-xs font-black text-amber-700 dark:text-amber-400">
                        {currentExchange.speakerName} • Sıra Sende!
                      </div>
                      <div className="text-xs text-slate-500 font-medium">
                        Cümleyi tamamlayarak hikayeyi devam ettir:
                      </div>
                    </div>
                  </div>

                  {/* Boşluklu Cümle Görünümü */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-slate-700 space-y-2">
                    <div className="text-base sm:text-xl font-black text-slate-900 dark:text-white leading-relaxed">
                      {currentExchange.blanks && currentExchange.blankTemplateEn ? (
                        <span>
                          {currentExchange.blankTemplateEn.split(/\[BLANK\d+\]/).map((part, index, array) => {
                            const blankId = `b${index + 1}`;
                            const chosenWord = userBlanks[blankId];
                            return (
                              <React.Fragment key={index}>
                                {part}
                                {index < array.length - 1 && (
                                  <span
                                    className={`inline-block px-3 py-1 mx-1.5 rounded-xl border-2 text-sm font-black transition-all ${
                                      chosenWord
                                        ? isExchangeComplete
                                          ? 'bg-emerald-100 border-emerald-500 text-emerald-900'
                                          : 'bg-indigo-100 border-indigo-400 text-indigo-900'
                                        : 'bg-amber-100 border-dashed border-amber-400 text-amber-700 min-w-[70px] text-center'
                                    }`}
                                  >
                                    {chosenWord || '___?___'}
                                  </span>
                                )}
                              </React.Fragment>
                            );
                          })}
                        </span>
                      ) : (
                        <span>"{currentExchange.fullEn}"</span>
                      )}
                    </div>
                    <div className="text-xs sm:text-sm text-slate-500 font-medium">
                      Türkçesi: "{currentExchange.fullTr}"
                    </div>
                  </div>

                  {/* Boşluklar İçin Seçenek Butonları */}
                  {currentExchange.blanks && !isExchangeComplete && (
                    <div className="space-y-3">
                      {currentExchange.blanks.map((b, bIdx) => (
                        <div key={b.id} className="space-y-1.5">
                          <span className="text-xs font-black text-slate-500">
                            Boşluk {bIdx + 1} için doğru kelimeyi seç:
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {b.options.map((opt) => {
                              const isSelected = userBlanks[b.id] === opt;
                              return (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => handleSelectBlankWord(b.id, opt)}
                                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer border ${
                                    isSelected
                                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm scale-105'
                                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                                  }`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Doğrulama & Devam Et Butonları */}
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    {!isExchangeComplete ? (
                      <button
                        type="button"
                        onClick={handleVerifyExchange}
                        className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer active:scale-95"
                      >
                        <span>Cevabı Kontrol Et & Konuş 🎯</span>
                      </button>
                    ) : (
                      <div className="space-y-3 w-full animate-fade-in">
                        <div className="p-3.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 text-xs font-black flex items-center space-x-2">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                          <span>Harika! Cümleyi kusursuz tamamladın. (+10 Hikaye Yıldızı)</span>
                        </div>

                        {currentExchange.explanationTr && (
                          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
                            <span className="font-black text-indigo-600">Pedagojik Not: </span>
                            {currentExchange.explanationTr}
                          </div>
                        )}

                        <div className="flex items-center space-x-3">
                          <button
                            type="button"
                            onClick={() => handleSpeak(currentExchange.fullEn)}
                            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center space-x-1.5 transition-all cursor-pointer"
                          >
                            <Volume2 className="w-4 h-4" />
                            <span>Tam Cümleyi Dinle</span>
                          </button>

                          <button
                            type="button"
                            onClick={handleNextExchange}
                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs flex items-center space-x-1.5 transition-all cursor-pointer shadow-md"
                          >
                            <span>Sonraki Diyaloğa Geç →</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChirmoStoryDialogueStudio;
