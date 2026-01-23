import productsReducer, { 
    getProductsThunk, 
    addProductThunk, 
    deleteProductThunk 
} from '@/store/productsSlice';

jest.mock('@/api/productService', () => ({
    getProducts: jest.fn(),
    addProduct: jest.fn(),
    deleteProduct: jest.fn(),
    updateProduct: jest.fn(),
}));

import { getProducts, addProduct, deleteProduct } from '@/api/productService';

describe('Redux Slice: productsSlice', () => {
    const initialState = {
        items: [],
        loading: false
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('devrait retourner l\'état initial par défaut', () => {
        expect(productsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    // TEST DE LA RÉCUPÉRATION (GET)
    test('devrait mettre à jour les items après getProductsThunk.fulfilled', () => {
        const mockProducts = [
            { id: 1, name: 'Clavier', price: 50 },
            { id: 2, name: 'Souris', price: 30 }
        ];

        const action = { type: getProductsThunk.fulfilled.type, payload: mockProducts };
        const state = productsReducer(initialState, action);

        expect(state.loading).toBe(false);
        expect(state.items).toEqual(mockProducts);
        expect(state.items).toHaveLength(2);
    });

    // TEST DE L'AJOUT (ADD)
    test('devrait ajouter un produit après addProductThunk.fulfilled', () => {
        const newProduct = { id: 3, name: 'Écran', price: 200 };
        const previousState = { items: [{ id: 1, name: 'Clavier' }], loading: false };

        const action = { type: addProductThunk.fulfilled.type, payload: newProduct };
        const state = productsReducer(previousState, action);

        expect(state.items).toHaveLength(2);
        expect(state.items[1].name).toBe('Écran');
    });

    // TEST DE LA SUPPRESSION (DELETE)
    test('devrait retirer le produit de la liste après deleteProductThunk.fulfilled', () => {
        const stateWithItems = {
            items: [
                { id: 1, name: 'Produit A' },
                { id: 2, name: 'Produit B' }
            ],
            loading: false
        };

        // Le payload du deleteThunk est l'ID retourné
        const action = { type: deleteProductThunk.fulfilled.type, payload: 1 };
        const state = productsReducer(stateWithItems, action);

        expect(state.items).toHaveLength(1);
        expect(state.items[0].id).toBe(2);
    });

    // TEST DU LOADING (PENDING)
    test('devrait passer loading à true quand une action est pending', () => {
        const action = { type: getProductsThunk.pending.type };
        const state = productsReducer(initialState, action);

        expect(state.loading).toBe(true);
    });
});