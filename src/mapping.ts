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

  dNft.deposit = event.params.deposit;
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
export function handleIsActiveUpdated(event: IsActiveUpdatedEvent): void {
  let dNft = DNft.load(event.params.id.toString());

  if (!dNft) {
    return;
  }

  dNft.isActive = event.params.isActive;
  dNft.save();
}

export function handleWithdrawalUpdated(event: WithdrawalUpdatedEvent): void {
  let dNft = DNft.load(event.params.id.toString());

  if (!dNft) {
    return;
  }

  dNft.withdrawal = event.params.withdrawal;
  dNft.save();
}

export function handleXpUpdated(event: XpUpdatedEvent): void {
  let dNft = DNft.load(event.params.id.toString());

  if (!dNft) {
    return;
  }

  dNft.xp = event.params.xp;
  dNft.save();
}
