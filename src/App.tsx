import { useState, useEffect } from "react";
import logoDark from "./assets/logo-dark.svg";
import "./tailwind.css";

export default function App() {
  const [wonValue, setWonValue] = useState<string>("");
  const [multiplier, setMultiplier] = useState<number>(1000000000);
  const [formattedValue, setFormattedValue] = useState<string | null>(null);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null); // Para armazenar a cotação

  // Função para formatar o valor
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

  // Função para buscar a cotação atual do Won
  const fetchExchangeRate = async () => {
    try {
      const apiKey = import.meta.env.VITE_API_KEY; // Acessando a chave da API do arquivo .env
      const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/KRW`);
      const data = await response.json();
      if (data && data.conversion_rates && data.conversion_rates.BRL) {
        setExchangeRate(data.conversion_rates.BRL); // Atualiza a cotação
      }
    } catch (error) {
      console.error("Erro ao buscar a cotação:", error);
    }
  };

  // Efeito para buscar a cotação quando o componente for montado
  useEffect(() => {
    fetchExchangeRate();
  }, []);

  // Efeito para calcular o valor formatado quando o Won ou a cotação mudarem
  useEffect(() => {
    if (!wonValue || exchangeRate === null) {
      setFormattedValue(null);
      return;
    }

    const wonInUnits = parseFloat(wonValue) * multiplier;
    const realValue = wonInUnits * exchangeRate; // Agora usa a cotação dinâmica
    setFormattedValue(formatValue(realValue));
  }, [wonValue, multiplier, exchangeRate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-500">
      <div className="flex flex-col items-center gap-8 p-6 bg-white rounded-lg shadow-lg w-full sm:max-w-md lg:max-w-lg">
        <header className="flex flex-col items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-800 text-center">Conversor de Won para Real</h1>
          <img
            src={logoDark}
            alt="Logo em tema escuro"
            className="h-12 dark:block hidden"
            width={"200vw"}
            height={"200vh"}
          />
        </header>
        <div className="w-full space-y-6 px-4">
          <div className="flex flex-col gap-4">
            <input
              type="number"
              value={wonValue}
              onChange={(e) => setWonValue(e.target.value)}
              placeholder="Digite o valor em Won"
              className="w-full p-4 border rounded-lg border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            />
            <select
              value={multiplier}
              onChange={(e) => setMultiplier(Number(e.target.value))}
              className="w-full p-4 border rounded-lg border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            >
              <option value={1000000000}>Bilhões</option>
              <option value={1000000}>Milhões</option>
              <option value={1000}>Mil</option>
              <option value={1}>Unidades</option>
            </select>
          </div>
          {formattedValue !== null && (
            <p className="text-center text-lg mt-4 text-gray-800">
              Valor em Real: <span className="font-bold">R$ {formattedValue}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
