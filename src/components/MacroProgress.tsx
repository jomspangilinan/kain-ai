interface MacroProgressProps {
  macros: {
    carbs: { consumed: number; total: number };
    protein: { consumed: number; total: number };
    fat: { consumed: number; total: number };
  };
}

const MacroProgress: React.FC<MacroProgressProps> = ({ macros }) => {
  const macroList = [
    { name: 'Carbs', ...macros.carbs, color: 'bg-blue-500' },
    { name: 'Protein', ...macros.protein, color: 'bg-green-500' },
    { name: 'Fat', ...macros.fat, color: 'bg-yellow-500' },
  ];

  return (
    <div className="bg-white shadow-md rounded-lg mx-4 mt-4 p-4">
      <h2 className="text-lg font-semibold text-gray-700">Macro Progress</h2>
      <div className="space-y-2 mt-2">
        {macroList.map((macro) => (
          <div key={macro.name}>
            <div className="flex justify-between text-sm text-gray-500">
              <span>{macro.name}</span>
              <span>
                {macro.consumed} / {macro.total}g
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div
                className={`${macro.color} h-2 rounded-full`}
                style={{ width: `${Math.min((macro.consumed / macro.total) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MacroProgress;