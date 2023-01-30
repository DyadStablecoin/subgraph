import { BigInt } from '@graphprotocol/graph-ts';
import {
  Deposited as DepositedEvent,
  DepositUpdated as DepositUpdatedEvent,
  IsActiveUpdated as IsActiveUpdatedEvent,
  Minted as MintedEvent,
  WithdrawalUpdated as WithdrawalUpdatedEvent,
  Withdrawn as WithdrawnEvent,
  XpUpdated as XpUpdatedEvent,
} from '../generated/DNft/DNft';
import { DNft, User } from '../generated/schema';

/// For initial deposit
export function handleDepositUpdated(event: DepositUpdatedEvent): void {
  let dNft = DNft.load(event.params.id.toString());

  if (!dNft) {
    return;
  }

  dNft.deposit = dNft.deposit.plus(event.params.deposit);
  dNft.save();
}

/// For subsequent deposits
export function handleDeposited(event: DepositedEvent): void {
  let dNft = DNft.load(event.params.id.toString());

  if (!dNft) {
    return;
  }

  dNft.deposit = dNft.deposit.plus(event.params.amount);
  dNft.save();
}

/// Creates DNft entities on mint
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

// TODO
export function handleIsActiveUpdated(event: IsActiveUpdatedEvent): void {}
export function handleWithdrawn(event: WithdrawnEvent): void {}
export function handleWithdrawalUpdated(event: WithdrawalUpdatedEvent): void {}

export function handleXpUpdated(event: XpUpdatedEvent): void {
  let dNft = DNft.load(event.params.id.toString());

  if (!dNft) {
    return;
  }

  dNft.xp = event.params.xp;
  dNft.save();
}
