import { CoinsModule } from './coins.module';

describe('CoinsModule', () => {
  let coinsModule: CoinsModule;

  beforeEach(() => {
    coinsModule = new CoinsModule();
  });

  it('should create an instance', () => {
    expect(coinsModule).toBeTruthy();
  });
});
