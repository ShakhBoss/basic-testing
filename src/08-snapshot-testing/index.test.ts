import { generateLinkedList } from './index';

describe('generateLinkedList', () => {
  test('should generate linked list from numeric values (toStrictEqual)', () => {
    const input = [1, 2, 3];
    const result = generateLinkedList(input);

    expect(result).toStrictEqual({
      value: 1,
      next: {
        value: 2,
        next: {
          value: 3,
          next: {
            value: null,
            next: null,
          },
        },
      },
    });
  });

  test('should generate linked list from string values (snapshot)', () => {
    const input = ['a', 'b', 'c'];
    const result = generateLinkedList(input);

    expect(result).toMatchSnapshot();
  });

  test('should return null head for empty array', () => {
    const result = generateLinkedList([]);

    expect(result).toStrictEqual({
      value: null,
      next: null,
    });
  });
});
