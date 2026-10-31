import React from 'react';
import Modal from '../../../components/ui/Modal.jsx';

export const SizeGuideModal = ({ isOpen, onClose }) => {
  const sizeChart = [
    { std: 'XS', it: 'IT 38', us: 'US 0-2', uk: 'UK 6', bust: '80-84 cm', waist: '60-64 cm', hip: '86-90 cm' },
    { std: 'S', it: 'IT 40', us: 'US 4', uk: 'UK 8', bust: '84-88 cm', waist: '64-68 cm', hip: '90-94 cm' },
    { std: 'M', it: 'IT 42', us: 'US 6', uk: 'UK 10', bust: '88-92 cm', waist: '68-72 cm', hip: '94-98 cm' },
    { std: 'L', it: 'IT 44', us: 'US 8', uk: 'UK 12', bust: '92-96 cm', waist: '72-76 cm', hip: '98-102 cm' },
    { std: 'XL', it: 'IT 46', us: 'US 10', uk: 'UK 14', bust: '96-102 cm', waist: '76-82 cm', hip: '102-108 cm' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Atelier Sizing & Proportions"
      subtitle="International Couture Conversions"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        <p className="text-xs text-luxury-600 leading-relaxed font-sans">
          Maison Étoile silhouettes are drafted according to classic European haute couture proportions. For sculpted bias-cut garments, we advise taking your exact measurements or contacting our concierge for bespoke fitting advice.
        </p>

        <div className="overflow-x-auto border border-luxury-200">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-luxury-100 text-[10px] uppercase tracking-widest text-luxury-800 border-b border-luxury-200">
              <tr>
                <th className="p-3">Standard</th>
                <th className="p-3">IT / FR</th>
                <th className="p-3">US</th>
                <th className="p-3">UK</th>
                <th className="p-3">Bust</th>
                <th className="p-3">Waist</th>
                <th className="p-3">Hips</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-luxury-200 text-luxury-900">
              {sizeChart.map((row, idx) => (
                <tr key={idx} className="hover:bg-luxury-50">
                  <td className="p-3 font-semibold">{row.std}</td>
                  <td className="p-3">{row.it}</td>
                  <td className="p-3">{row.us}</td>
                  <td className="p-3">{row.uk}</td>
                  <td className="p-3 text-luxury-600">{row.bust}</td>
                  <td className="p-3 text-luxury-600">{row.waist}</td>
                  <td className="p-3 text-luxury-600">{row.hip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-luxury-100 border-l-2 border-luxury-gold text-xs text-luxury-800 space-y-1">
          <p className="font-semibold uppercase tracking-wider text-[11px]">Bespoke Alteration Concierge</p>
          <p className="text-luxury-600">
            Complimentary hem and waist tailoring is available on all evening couture gowns. Email concierge@maisonetoile.com with your order number.
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default SizeGuideModal;
