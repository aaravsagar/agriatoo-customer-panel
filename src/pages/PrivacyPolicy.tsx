import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Globe } from 'lucide-react';
import Logo from '../components/UI/Logo';

const PrivacyPolicy: React.FC = () => {
  const [language, setLanguage] = useState<'en' | 'hi' | 'gu'>('en');

  const content = {
    en: {
      title: 'Privacy Policy',
      lastUpdated: 'Last updated: December 2024',
      sections: [
        {
          title: '1. Information We Collect',
          content: 'We collect information you provide directly (name, phone, address, email), usage data (how you use our app), and device information (device type, operating system).'
        },
        {
          title: '2. How We Use Your Information',
          content: 'We use your information to process orders, provide customer support, improve our services, send order updates, and comply with legal requirements.'
        },
        {
          title: '3. Information Sharing',
          content: 'We share your information with sellers to fulfill orders, delivery partners for shipping, payment processors for transactions, and service providers who help us operate our platform.'
        },
        {
          title: '4. Data Security',
          content: 'We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.'
        },
        {
          title: '5. Your Rights',
          content: 'You can access, update, or delete your personal information through your account settings. You can also contact us to exercise these rights.'
        },
        {
          title: '6. Cookies and Tracking',
          content: 'We use cookies and similar technologies to improve your experience, analyze usage patterns, and provide personalized content.'
        },
        {
          title: '7. Data Retention',
          content: 'We retain your information for as long as necessary to provide services, comply with legal obligations, and resolve disputes.'
        },
        {
          title: '8. Contact Us',
          content: 'If you have questions about this privacy policy, contact us at support@agriatoo.com or +91-9999-AGRI-TOO.'
        }
      ]
    },
    hi: {
      title: 'गोपनीयता नीति',
      lastUpdated: 'अंतिम अपडेट: दिसंबर 2024',
      sections: [
        {
          title: '1. हम जो जानकारी एकत्र करते हैं',
          content: 'हम आपके द्वारा सीधे प्रदान की गई जानकारी (नाम, फोन, पता, ईमेल), उपयोग डेटा (आप हमारे ऐप का उपयोग कैसे करते हैं), और डिवाइस जानकारी (डिवाइस प्रकार, ऑपरेटिंग सिस्टम) एकत्र करते हैं।'
        },
        {
          title: '2. हम आपकी जानकारी का उपयोग कैसे करते हैं',
          content: 'हम आपकी जानकारी का उपयोग ऑर्डर प्रोसेस करने, ग्राहक सहायता प्रदान करने, अपनी सेवाओं में सुधार करने, ऑर्डर अपडेट भेजने और कानूनी आवश्यकताओं का अनुपालन करने के लिए करते हैं।'
        },
        {
          title: '3. जानकारी साझाकरण',
          content: 'हम आपकी जानकारी ऑर्डर पूरा करने के लिए विक्रेताओं के साथ, शिपिंग के लिए डिलीवरी पार्टनर्स के साथ, लेनदेन के लिए भुगतान प्रोसेसर के साथ, और सेवा प्रदाताओं के साथ साझा करते हैं जो हमारे प्लेटफॉर्म को संचालित करने में मदद करते हैं।'
        },
        {
          title: '4. डेटा सुरक्षा',
          content: 'हम आपकी व्यक्तिगत जानकारी की सुरक्षा के लिए उपयुक्त सुरक्षा उपाय लागू करते हैं। हालांकि, इंटरनेट पर ट्रांसमिशन का कोई भी तरीका 100% सुरक्षित नहीं है।'
        },
        {
          title: '5. आपके अधिकार',
          content: 'आप अपनी खाता सेटिंग्स के माध्यम से अपनी व्यक्तिगत जानकारी तक पहुंच सकते हैं, अपडेट कर सकते हैं या हटा सकते हैं। आप इन अधिकारों का प्रयोग करने के लिए हमसे संपर्क भी कर सकते हैं।'
        },
        {
          title: '6. कुकीज़ और ट्रैकिंग',
          content: 'हम आपके अनुभव को बेहतर बनाने, उपयोग पैटर्न का विश्लेषण करने और व्यक्तिगत सामग्री प्रदान करने के लिए कुकीज़ और समान तकनीकों का उपयोग करते हैं।'
        },
        {
          title: '7. डेटा प्रतिधारण',
          content: 'हम आपकी जानकारी को तब तक बनाए रखते हैं जब तक सेवाएं प्रदान करने, कानूनी दायित्वों का अनुपालन करने और विवादों को हल करने के लिए आवश्यक हो।'
        },
        {
          title: '8. हमसे संपर्क करें',
          content: 'यदि आपके पास इस गोपनीयता नीति के बारे में प्रश्न हैं, तो हमसे support@agriatoo.com या +91-9999-AGRI-TOO पर संपर्क करें।'
        }
      ]
    },
    gu: {
      title: 'ગોપનીયતા નીતિ',
      lastUpdated: 'છેલ્લે અપડેટ: ડિસેમ્બર 2024',
      sections: [
        {
          title: '1. અમે જે માહિતી એકત્રિત કરીએ છીએ',
          content: 'અમે તમારા દ્વારા સીધી પ્રદાન કરેલી માહિતી (નામ, ફોન, સરનામું, ઈમેઈલ), ઉપયોગ ડેટા (તમે અમારી એપ્લિકેશનનો ઉપયોગ કેવી રીતે કરો છો), અને ઉપકરણ માહિતી (ઉપકરણ પ્રકાર, ઓપરેટિંગ સિસ્ટમ) એકત્રિત કરીએ છીએ.'
        },
        {
          title: '2. અમે તમારી માહિતીનો ઉપયોગ કેવી રીતે કરીએ છીએ',
          content: 'અમે તમારી માહિતીનો ઉપયોગ ઓર્ડર પ્રોસેસ કરવા, ગ્રાહક સહાય પ્રદાન કરવા, અમારી સેવાઓ સુધારવા, ઓર્ડર અપડેટ મોકલવા અને કાનૂની આવશ્યકતાઓનું પાલન કરવા માટે કરીએ છીએ.'
        },
        {
          title: '3. માહિતી શેરિંગ',
          content: 'અમે તમારી માહિતી ઓર્ડર પૂર્ણ કરવા માટે વિક્રેતાઓ સાથે, શિપિંગ માટે ડિલિવરી પાર્ટનર્સ સાથે, વ્યવહારો માટે પેમેન્ટ પ્રોસેસર્સ સાથે, અને સેવા પ્રદાતાઓ સાથે શેર કરીએ છીએ જેઓ અમારા પ્લેટફોર્મને ચલાવવામાં મદદ કરે છે.'
        },
        {
          title: '4. ડેટા સુરક્ષા',
          content: 'અમે તમારી વ્યક્તિગત માહિતીની સુરક્ષા માટે યોગ્ય સુરક્ષા પગલાં લાગુ કરીએ છીએ. જો કે, ઇન્ટરનેટ પર ટ્રાન્સમિશનની કોઈ પણ પદ્ધતિ 100% સુરક્ષિત નથી.'
        },
        {
          title: '5. તમારા અધિકારો',
          content: 'તમે તમારા એકાઉન્ટ સેટિંગ્સ દ્વારા તમારી વ્યક્તિગત માહિતીને ઍક્સેસ, અપડેટ અથવા ડિલીટ કરી શકો છો. તમે આ અધિકારોનો ઉપયોગ કરવા માટે અમારો સંપર્ક પણ કરી શકો છો.'
        },
        {
          title: '6. કુકીઝ અને ટ્રેકિંગ',
          content: 'અમે તમારા અનુભવને સુધારવા, ઉપયોગ પેટર્નનું વિશ્લેષણ કરવા અને વ્યક્તિગત સામગ્રી પ્રદાન કરવા માટે કુકીઝ અને સમાન તકનીકોનો ઉપયોગ કરીએ છીએ.'
        },
        {
          title: '7. ડેટા રીટેન્શન',
          content: 'અમે તમારી માહિતીને સેવાઓ પ્રદાન કરવા, કાનૂની જવાબદારીઓનું પાલન કરવા અને વિવાદોને ઉકેલવા માટે જરૂરી હોય ત્યાં સુધી જાળવીએ છીએ.'
        },
        {
          title: '8. અમારો સંપર્ક કરો',
          content: 'જો તમારી પાસે આ ગોપનીયતા નીતિ વિશે પ્રશ્નો છે, તો અમારો સંપર્ક support@agriatoo.com અથવા +91-9999-AGRI-TOO પર કરો.'
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
              For questions about this privacy policy, contact us at{' '}
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

export default PrivacyPolicy;
