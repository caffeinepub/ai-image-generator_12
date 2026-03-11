import Array "mo:core/Array";
import Map "mo:core/Map";
import Int "mo:core/Int";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";

actor {
  type Timestamp = Int;

  type GenerationRecord = {
    id : Nat;
    prompt : Text;
    platform : Text;
    imageUrl : Text;
    width : Nat;
    height : Nat;
    timestamp : Timestamp;
  };

  module GenerationRecord {
    public func compareByTimestampDesc(a : GenerationRecord, b : GenerationRecord) : Order.Order {
      Int.compare(b.timestamp, a.timestamp);
    };
  };

  let records = Map.empty<Nat, GenerationRecord>();
  var nextId = 0;

  public shared ({ caller }) func saveGenerationRecord(prompt : Text, platform : Text, imageUrl : Text, width : Nat, height : Nat) : async () {
    let record : GenerationRecord = {
      id = nextId;
      prompt;
      platform;
      imageUrl;
      width;
      height;
      timestamp = Time.now();
    };
    records.add(nextId, record);
    nextId += 1;
  };

  public query ({ caller }) func getAllGenerationRecords() : async [GenerationRecord] {
    records.values().toArray().sort(GenerationRecord.compareByTimestampDesc);
  };

  public shared ({ caller }) func deleteGenerationRecord(id : Nat) : async () {
    if (not records.containsKey(id)) {
      Runtime.trap("Record with id " # id.toText() # " does not exist. Deletion failed.");
    };
    records.remove(id);
  };
};
