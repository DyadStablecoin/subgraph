import { BigInt } from '@graphprotocol/graph-ts';
import {
  Deposited as DepositedEvent,
  Minted as MintedEvent,
  XpIncreased as XpIncreasedEvent,
} from '../generated/DNft/DNft';
import { DNft, User } from '../generated/schema';

export function handleMinted(event: MintedEvent): void {
  let dNft = new DNft(event.params.id.toString());

  dNft.xp = BigInt.fromString('0'); // init to 0, will update in handleXpIncreased
  dNft.deposit = BigInt.fromString('0'); // init to 0, will update in handleDeposited
  dNft.withdrawal = BigInt.fromString('0');
  dNft.lastOwnershipChange = event.block.number;
  dNft.isActive = true;
  dNft.owner = event.params.to.toHexString();

  dNft.save();

  // Associate the DNft with its user
  let user = User.load(event.params.to.toHexString());
  if (!user) {
    user = new User(event.params.to.toHexString());
    user.save();
  }
}

export function handleXpIncreased(event: XpIncreasedEvent): void {
  let dNft = DNft.load(event.params.id.toString());

  if (!dNft) {
    return;
  }

  dNft.xp = dNft.xp.plus(event.params.amount);
  dNft.save();
}

// how does initial dyad get minted?
export function handleDeposited(event: DepositedEvent): void {
  let dNft = DNft.load(event.params.id.toString());

  if (!dNft) {
    return;
  }

  dNft.deposit = event.params.amount;
  dNft.save();
}
