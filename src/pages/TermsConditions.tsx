import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Globe } from 'lucide-react';
import Logo from '../components/UI/Logo';

const TermsConditions: React.FC = () => {
  const [language, setLanguage] = useState<'en' | 'hi' | 'gu'>('en');

  const content = {
    en: {
      title: 'Terms & Conditions',
      lastUpdated: 'Last updated: December 2024',
      sections: [
        {
          title: '1. Acceptance of Terms',
          content: 'By using AGRIATOO services, you agree to these terms and conditions. If you do not agree, please do not use our platform.'
        },
        {
          title: '2. Service Description',
          content: 'AGRIATOO is an online marketplace connecting farmers and agricultural businesses in Gujarat with quality agricultural products including fertilizers, pesticides, seeds, and farming tools.'
        },
        {
          title: '3. User Accounts',
          content: 'You must provide accurate information when creating an account. You are responsible for maintaining the security of your account and all activities under your account.'
        },
        {
          title: '4. Orders and Payments',
          content: 'All orders are subject to availability. We accept Cash on Delivery (COD) payments. Prices are in Indian Rupees and include applicable taxes.'
        },
        {
          title: '5. Delivery Terms',
          content: 'We deliver within Gujarat state. Delivery times are estimates and may vary due to weather, location, or other factors beyond our control.'
        },
        {
          title: '6. Product Quality',
          content: 'We work with verified sellers to ensure product quality. However, agricultural products may vary due to natural factors. We provide return/exchange options for defective products.'
        },
        {
          title: '7. Limitation of Liability',
          content: 'AGRIATOO is not liable for any indirect, incidental, or consequential damages arising from the use of our services or products purchased through our platform.'
        },
        {
          title: '8. Governing Law',
          content: 'These terms are governed by the laws of Gujarat, India. Any disputes will be resolved in Gujarat courts.'
        }
      ]
    },
    hi: {
      title: 'नियम और शर्तें',
      lastUpdated: 'अंतिम अपडेट: दिसंबर 2024',
      sections: [
        {
          title: '1. शर्तों की स्वीकृति',
          content: 'AGRIATOO सेवाओं का उपयोग करके, आप इन नियमों और शर्तों से सहमत हैं। यदि आप सहमत नहीं हैं, तो कृपया हमारे प्लेटफॉर्म का उपयोग न करें।'
        },
        {
          title: '2. सेवा विवरण',
          content: 'AGRIATOO एक ऑनलाइन मार्केटप्लेस है जो गुजरात में किसानों और कृषि व्यवसायों को उर्वरक, कीटनाशक, बीज और कृषि उपकरणों सहित गुणवत्तापूर्ण कृषि उत्पादों से जोड़ता है।'
        },
        {
          title: '3. उपयोगकर्ता खाते',
          content: 'खाता बनाते समय आपको सटीक जानकारी प्रदान करनी होगी। आप अपने खाते की सुरक्षा और अपने खाते के तहत सभी गतिविधियों के लिए जिम्मेदार हैं।'
        },
        {
          title: '4. ऑर्डर और भुगतान',
          content: 'सभी ऑर्डर उपलब्धता के अधीन हैं। हम कैश ऑन डिलीवरी (COD) भुगतान स्वीकार करते हैं। कीमतें भारतीय रुपए में हैं और लागू करों को शामिल करती हैं।'
        },
        {
          title: '5. डिलीवरी शर्तें',
          content: 'हम गुजरात राज्य के भीतर डिलीवरी करते हैं। डिलीवरी का समय अनुमानित है और मौसम, स्थान या हमारे नियंत्रण से बाहर के अन्य कारकों के कारण भिन्न हो सकता है।'
        },
        {
          title: '6. उत्पाद गुणवत्ता',
          content: 'हम उत्पाद गुणवत्ता सुनिश्चित करने के लिए सत्यापित विक्रेताओं के साथ काम करते हैं। हालांकि, प्राकृतिक कारकों के कारण कृषि उत्पाद भिन्न हो सकते हैं। हम दोषपूर्ण उत्पादों के लिए वापसी/विनिमय विकल्प प्रदान करते हैं।'
        },
        {
          title: '7. दायित्व की सीमा',
          content: 'AGRIATOO हमारी सेवाओं के उपयोग या हमारे प्लेटफॉर्म के माध्यम से खरीदे गए उत्पादों से उत्पन्न किसी भी अप्रत्यक्ष, आकस्मिक या परिणामी नुकसान के लिए उत्तरदायी नहीं है।'
        },
        {
          title: '8. शासी कानून',
          content: 'ये शर्तें गुजरात, भारत के कानूनों द्वारा शासित हैं। कोई भी विवाद गुजरात की अदालतों में हल किया जाएगा।'
        }
      ]
    },
    gu: {
      title: 'નિયમો અને શરતો',
      lastUpdated: 'છેલ્લે અપડેટ: ડિસેમ્બર 2024',
      sections: [
        {
          title: '1. શરતોની સ્વીકૃતિ',
          content: 'AGRIATOO સેવાઓનો ઉપયોગ કરીને, તમે આ નિયમો અને શરતો સાથે સંમત છો. જો તમે સંમત નથી, તો કૃપા કરીને અમારા પ્લેટફોર્મનો ઉપયોગ કરશો નહીં.'
        },
        {
          title: '2. સેવા વર્ણન',
          content: 'AGRIATOO એક ઓનલાઇન માર્કેટપ્લેસ છે જે ગુજરાતમાં ખેડૂતો અને કૃષિ વ્યવસાયોને ખાતર, જંતુનાશક, બીજ અને ખેતીના સાધનો સહિત ગુણવત્તાયુક્ત કૃષિ ઉત્પાદનો સાથે જોડે છે.'
        },
        {
          title: '3. વપરાશકર્તા ખાતા',
          content: 'ખાતું બનાવતી વખતે તમારે સચોટ માહિતી પ્રદાન કરવી જોઈએ. તમે તમારા ખાતાની સુરક્ષા અને તમારા ખાતા હેઠળની તમામ પ્રવૃત્તિઓ માટે જવાબદાર છો.'
        },
        {
          title: '4. ઓર્ડર અને ચુકવણી',
          content: 'બધા ઓર્ડર ઉપલબ્ધતાને આધીન છે. અમે કેશ ઓન ડિલિવરી (COD) ચુકવણી સ્વીકારીએ છીએ. કિંમતો ભારતીય રૂપિયામાં છે અને લાગુ કરને સમાવે છે.'
        },
        {
          title: '5. ડિલિવરી શરતો',
          content: 'અમે ગુજરાત રાજ્યની અંદર ડિલિવરી કરીએ છીએ. ડિલિવરીનો સમય અંદાજિત છે અને હવામાન, સ્થાન અથવા અમારા નિયંત્રણની બહારના અન્ય પરિબળોને કારણે બદલાઈ શકે છે.'
        },
        {
          title: '6. ઉત્પાદન ગુણવત્તા',
          content: 'અમે ઉત્પાદનની ગુણવત્તા સુનિશ્ચિત કરવા માટે ચકાસાયેલા વિક્રેતાઓ સાથે કામ કરીએ છીએ. જો કે, કુદરતી પરિબળોને કારણે કૃષિ ઉત્પાદનો અલગ હોઈ શકે છે. અમે ખામીયુક્ત ઉત્પાદનો માટે વળતર/વિનિમય વિકલ્પો પ્રદાન કરીએ છીએ.'
        },
        {
          title: '7. જવાબદારીની મર્યાદા',
          content: 'AGRIATOO અમારી સેવાઓના ઉપયોગ અથવા અમારા પ્લેટફોર્મ દ્વારા ખરીદેલા ઉત્પાદનોથી ઉદ્ભવતા કોઈપણ પરોક્ષ, આકસ્મિક અથવા પરિણામી નુકસાન માટે જવાબદાર નથી.'
        },
        {
          title: '8. શાસક કાયદો',
          content: 'આ શરતો ગુજરાત, ભારતના કાયદાઓ દ્વારા સંચાલિત છે. કોઈપણ વિવાદ ગુજરાતની અદાલતોમાં ઉકેલાશે.'
        }
      ]
    }
  };

  const currentContent = content[language];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="flex items-center text-green-600 hover:text-green-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Home
              </Link>
              <Logo size="md" />
            </div>
            
            {/* Language Selector */}
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-gray-500" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'en' | 'hi' | 'gu')}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="gu">ગુજરાતી</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentContent.title}</h1>
            <p className="text-gray-600">{currentContent.lastUpdated}</p>
          </div>

          <div className="prose prose-green max-w-none">
            {currentContent.sections.map((section, index) => (
              <div key={index} className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">{section.title}</h2>
                <p className="text-gray-700 leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 text-center">
            <p className="text-gray-600">
              For questions about these terms, contact us at{' '}
              <a href="mailto:support@agriatoo.com" className="text-green-600 hover:text-green-700">
                support@agriatoo.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;