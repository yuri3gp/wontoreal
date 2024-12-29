import { useState, useEffect } from "react";
import logoDark from "./logo-dark.svg";
import logoLight from "./logo-light.svg";

export function Welcome() {
  const [wonValue, setWonValue] = useState<string>("");
  const [multiplier, setMultiplier] = useState<number>(4);
  const [formattedValue, setFormattedValue] = useState<string | null>(null);

  const formatValue = (value: number): string => {
    if (value >= 1_000_000_000) {
      return `${(value / 1_000_000_000).toFixed(2).replace(".", ",")} bilhões`;
    } else if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(2).replace(".", ",")} milhões`;
    } else if (value >= 1_000) {
      return `${(value / 1_000).toFixed(2).replace(".", ",")} mil`;
    } else {
      return `${value.toFixed(2).replace(".", ",")}`;
    }
  };

  useEffect(() => {
    if (!wonValue) {
      setFormattedValue(null);
      return;
    }

    const wonInUnits = parseFloat(wonValue) * multiplier;
    const realValue = wonInUnits * 0.0038; // Exemplo: 1 Won = 0.0038 Real
    setFormattedValue(formatValue(realValue));
  }, [wonValue, multiplier]);

  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
        <header className="flex flex-col items-center gap-4">
          <h1 className="text-3xl font-bold">Conversor de Won para Real</h1>
          <img
            src={"https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Flag_of_South_Korea.svg/2560px-Flag_of_South_Korea.svg.png"}
            alt="Logo em tema escuro"
            className="h-12 dark:block hidden"
          />
          <img
            src={logoLight}
            alt="Logo em tema claro"
            className="h-12 block dark:hidden"
          />
        </header>
        <div className="max-w-[400px] w-full space-y-6 px-4">
          <div className="flex flex-col gap-4">
            <input
              type="number"
              value={wonValue}
              onChange={(e) => setWonValue(e.target.value)}
              placeholder="Digite o valor em Won"
              className="w-full p-2 border rounded-lg border-gray-300 dark:border-gray-700"
            />
            <select
              value={multiplier}
              onChange={(e) => setMultiplier(Number(e.target.value))}
              className="w-full p-2 border rounded-lg border-gray-300 dark:border-gray-700"
            >
              <option value={1000000000}>Bilhões</option>
              <option value={1000000}>Milhões</option>
              <option value={1000}>Mil</option>
              <option value={1}>Unidades</option>
            </select>
          </div>
          {formattedValue !== null && (
            <p className="text-center text-lg mt-4">
              Valor em Real: <span className="font-bold">R$ {formattedValue}</span>
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
