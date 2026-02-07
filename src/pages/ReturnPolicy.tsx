import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Globe } from 'lucide-react';
import Logo from '../components/UI/Logo';

const ReturnPolicy: React.FC = () => {
  const [language, setLanguage] = useState<'en' | 'hi' | 'gu'>('en');

  const content = {
    en: {
      title: 'Return Policy',
      lastUpdated: 'Last updated: December 2024',
      sections: [
        {
          title: '1. Return Eligibility',
          content: 'Items can be returned within 7 days of delivery if they are damaged, defective, or not as described. Agricultural products must be in original packaging and unused.'
        },
        {
          title: '2. Non-Returnable Items',
          content: 'Perishable items, opened fertilizers or pesticides, custom-mixed products, and items damaged due to misuse cannot be returned for safety and quality reasons.'
        },
        {
          title: '3. Return Process',
          content: 'Contact our customer service at +91-9999-AGRI-TOO or support@agriatoo.com within 7 days. Provide order number, photos of the issue, and reason for return.'
        },
        {
          title: '4. Inspection and Approval',
          content: 'Our team will inspect returned items within 2-3 business days. We reserve the right to reject returns that do not meet our return policy criteria.'
        },
        {
          title: '5. Refund Process',
          content: 'Approved returns will be refunded to your original payment method within 5-7 business days. For COD orders, refunds will be processed via bank transfer.'
        },
        {
          title: '6. Return Shipping',
          content: 'We will arrange pickup for defective or damaged items at no cost to you. For other returns, shipping costs may apply as per our discretion.'
        },
        {
          title: '7. Exchanges',
          content: 'We offer exchanges for defective products subject to availability. Exchanges are processed faster than returns and refunds.'
        },
        {
          title: '8. Damaged in Transit',
          content: 'Report damaged packages immediately upon delivery. We will replace damaged items or provide full refund at no additional cost.'
        }
      ]
    },
    hi: {
      title: 'वापसी नीति',
      lastUpdated: 'अंतिम अपडेट: दिसंबर 2024',
      sections: [
        {
          title: '1. वापसी पात्रता',
          content: 'डिलीवरी के 7 दिनों के भीतर आइटम वापस किए जा सकते हैं यदि वे क्षतिग्रस्त, दोषपूर्ण या वर्णन के अनुसार नहीं हैं। कृषि उत्पाद मूल पैकेजिंग में और अप्रयुक्त होने चाहिए।'
        },
        {
          title: '2. गैर-वापसी योग्य आइटम',
          content: 'खराब होने वाले आइटम, खुले उर्वरक या कीटनाशक, कस्टम-मिश्रित उत्पाद, और दुरुपयोग के कारण क्षतिग्रस्त आइटम सुरक्षा और गुणवत्ता कारणों से वापस नहीं किए जा सकते।'
        },
        {
          title: '3. वापसी प्रक्रिया',
          content: '7 दिनों के भीतर +91-9999-AGRI-TOO या support@agriatoo.com पर हमारी ग्राहक सेवा से संपर्क करें। ऑर्डर नंबर, समस्या की तस्वीरें और वापसी का कारण प्रदान करें।'
        },
        {
          title: '4. निरीक्षण और अनुमोदन',
          content: 'हमारी टीम 2-3 व्यावसायिक दिनों के भीतर वापसी आइटम का निरीक्षण करेगी। हम उन वापसी को अस्वीकार करने का अधिकार सुरक्षित रखते हैं जो हमारी वापसी नीति मानदंडों को पूरा नहीं करती।'
        },
        {
          title: '5. रिफंड प्रक्रिया',
          content: 'अनुमोदित वापसी को 5-7 व्यावसायिक दिनों के भीतर आपकी मूल भुगतान विधि में वापस कर दिया जाएगा। COD ऑर्डर के लिए, रिफंड बैंक ट्रांसफर के माध्यम से प्रोसेस किया जाएगा।'
        },
        {
          title: '6. वापसी शिपिंग',
          content: 'हम दोषपूर्ण या क्षतिग्रस्त आइटम के लिए आपकी कोई लागत के बिना पिकअप की व्यवस्था करेंगे। अन्य वापसी के लिए, हमारे विवेक के अनुसार शिपिंग लागत लागू हो सकती है।'
        },
        {
          title: '7. एक्सचेंज',
          content: 'हम उपलब्धता के आधार पर दोषपूर्ण उत्पादों के लिए एक्सचेंज की पेशकश करते हैं। एक्सचेंज वापसी और रिफंड से तेज़ प्रोसेस होते हैं।'
        },
        {
          title: '8. ट्रांजिट में क्षतिग्रस्त',
          content: 'डिलीवरी पर तुरंत क्षतिग्रस्त पैकेज की रिपोर्ट करें। हम क्षतिग्रस्त आइटम को बदल देंगे या बिना किसी अतिरिक्त लागत के पूर्ण रिफंड प्रदान करेंगे।'
        }
      ]
    },
    gu: {
      title: 'વળતર નીતિ',
      lastUpdated: 'છેલ્લે અપડેટ: ડિસેમ્બર 2024',
      sections: [
        {
          title: '1. વળતર પાત્રતા',
          content: 'ડિલિવરીના 7 દિવસની અંદર આઇટમ્સ પરત કરી શકાય છે જો તે ક્ષતિગ્રસ્ત, ખામીયુક્ત અથવા વર્ણન મુજબ ન હોય. કૃષિ ઉત્પાદનો મૂળ પેકેજિંગમાં અને બિનઉપયોગી હોવા જોઈએ.'
        },
        {
          title: '2. બિન-વળતરપાત્ર આઇટમ્સ',
          content: 'બગડી શકે તેવી વસ્તુઓ, ખુલ્લા ખાતર અથવા જંતુનાશકો, કસ્ટમ-મિશ્રિત ઉત્પાદનો, અને દુરુપયોગને કારણે ક્ષતિગ્રસ્ત આઇટમ્સ સુરક્ષા અને ગુણવત્તાના કારણોસર પરત કરી શકાતી નથી.'
        },
        {
          title: '3. વળતર પ્રક્રિયા',
          content: '7 દિવસની અંદર +91-9999-AGRI-TOO અથવા support@agriatoo.com પર અમારી ગ્રાહક સેવાનો સંપર્ક કરો. ઓર્ડર નંબર, સમસ્યાના ફોટા અને વળતરનું કારણ પ્રદાન કરો.'
        },
        {
          title: '4. તપાસ અને મંજૂરી',
          content: 'અમારી ટીમ 2-3 વ્યાવસાયિક દિવસોમાં વળતર આઇટમ્સની તપાસ કરશે. અમે અમારી વળતર નીતિના માપદંડોને પૂર્ણ ન કરતી વળતરને નકારવાનો અધિકાર અનામત રાખીએ છીએ.'
        },
        {
          title: '5. રિફંડ પ્રક્રિયા',
          content: 'મંજૂર વળતરને 5-7 વ્યાવસાયિક દિવસોમાં તમારી મૂળ ચુકવણી પદ્ધતિમાં પરત કરવામાં આવશે. COD ઓર્ડર માટે, રિફંડ બેંક ટ્રાન્સફર દ્વારા પ્રોસેસ કરવામાં આવશે.'
        },
        {
          title: '6. વળતર શિપિંગ',
          content: 'અમે ખામીયુક્ત અથવા ક્ષતિગ્રસ્ત આઇટમ્સ માટે તમારી કોઈ કિંમત વિના પિકઅપની વ્યવસ્થા કરીશું. અન્ય વળતર માટે, અમારા વિવેક મુજબ શિપિંગ ખર્ચ લાગુ થઈ શકે છે.'
        },
        {
          title: '7. એક્સચેન્જ',
          content: 'અમે ઉપલબ્ધતાને આધારે ખામીયુક્ત ઉત્પાદનો માટે એક્સચેન્જ ઓફર કરીએ છીએ. એક્સચેન્જ વળતર અને રિફંડ કરતાં ઝડપથી પ્રોસેસ થાય છે.'
        },
        {
          title: '8. ટ્રાન્ઝિટમાં ક્ષતિગ્રસ્ત',
          content: 'ડિલિવરી પર તરત જ ક્ષતિગ્રસ્ત પેકેજની જાણ કરો. અમે ક્ષતિગ્રસ્ત આઇટમ્સને બદલીશું અથવા કોઈ વધારાની કિંમત વિના સંપૂર્ણ રિફંડ પ્રદાન કરીશું.'
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
              For return requests or questions, contact us at{' '}
              <a href="mailto:support@agriatoo.com" className="text-green-600 hover:text-green-700">
                support@agriatoo.com
              </a>{' '}
              or call{' '}
              <a href="tel:+919999274486" className="text-green-600 hover:text-green-700">
                +91-9999-AGRI-TOO
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicy;