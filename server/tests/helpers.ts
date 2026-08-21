import { jest } from "@jest/globals"

/**
 * Mongoose queries (Model.find().sort().populate()) are thenable chains.
 * This fakes that shape: every chain method returns the chain itself, and
 * awaiting the chain resolves to `finalValue`.
 */
export function mockQueryChain<T>(finalValue: T) {
  const chain = {
    select: jest.fn(() => chain),
    sort: jest.fn(() => chain),
    populate: jest.fn(() => chain),
    then: (resolve: (value: T) => void) => resolve(finalValue),
  }
  return chain
}
