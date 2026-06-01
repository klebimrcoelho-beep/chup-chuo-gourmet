// Configurações Globais da Loja - Doçuras Geladas
const STORE_CONFIG = {
    name: "Doçuras Geladas | Chup Chup Gourmet",
    whatsapp: "5511999999999", // IMPORTANTE: Substitua pelo número real do lojista (com DDI e DDD, sem espaços ou traços)
    deliveryFee: 5.00,        // Taxa de entrega fixa (0 para grátis)
    currency: "R$",           // Símbolo monetário
    instagram: "@chupchupgoumetdocurasgelada", // Instagram Real da loja
    address: "Atendimento via Delivery & Encomendas para Festas",
    paymentMethods: [
        "Pix (Chave informada no envio)",
        "Dinheiro (levar troco)",
        "Cartão de Crédito/Débito (na entrega)"
    ]
};

// Categorias dos Produtos
const CATEGORIES = [
    { id: "all", name: "Todos os Sabores" },
    { id: "gourmet", name: "Gourmet Premium" },
    { id: "frutados", name: "Frutas Cremosas" },
    { id: "especiais", name: "Edições Especiais" },
    { id: "combos", name: "Kits Promocionais" }
];

// Lista de Produtos - Chup Chup Gourmet (Usando as imagens de fotorrealismo de alta resolução geradas)
const PRODUCTS = [
    {
        id: 1,
        name: "Ninho com Nutella Gourmet",
        category: "gourmet",
        price: 7.00,
        description: "O queridinho do catálogo! Creme super aveludado de Leite Ninho original recheado com bastante creme de avelã Nutella genuíno.",
        image: "imagens/Instagram_files/chup_ninho_nutella.png",
        badge: "Mais Vendido"
    },
    {
        id: 2,
        name: "Sensação (Morango c/ Nutella)",
        category: "gourmet",
        price: 7.50,
        description: "Mousse artesanal de morangos selecionados combinado com uma generosa camada de Nutella cremosa. A união perfeita do azedinho com o doce.",
        image: "imagens/Instagram_files/chup_sensacao.png",
        badge: "Irresistível"
    },
    {
        id: 3,
        name: "Mousse de Maracujá Cremoso",
        category: "frutados",
        price: 6.00,
        description: "Delicioso mousse cremoso de maracujá feito com a fruta pura. Acompanha sementes crocantes e calda artesanal no fundo do saquinho.",
        image: "imagens/Instagram_files/chup_maracuja.png",
        badge: "Refrescante"
    },
    {
        id: 4,
        name: "Oreo Crocante",
        category: "gourmet",
        price: 7.00,
        description: "Base super cremosa de baunilha mesclada com pedacinhos crocantes de biscoito Oreo original. Textura inigualável e muito saborosa.",
        image: "imagens/Instagram_files/chup_oreo.png",
        badge: "Favorito"
    }
];

// Compartilha os dados de forma global na janela
window.STORE_CONFIG = STORE_CONFIG;
window.CATEGORIES = CATEGORIES;
window.PRODUCTS = PRODUCTS;
