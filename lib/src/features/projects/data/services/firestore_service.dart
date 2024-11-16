import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
part 'firestore_service.g.dart';

/// Custom Exception for Firestore
class FirestoreException implements Exception {
  const FirestoreException(this.message, this.errorType);
  final String message;
  final FirestoreErrorType errorType;

  @override
  String toString() => 'FirestoreException [$errorType]:\n$message';
}

enum FirestoreErrorType {
  addError,
  updateError,
  deleteError,
  readError,
}

/// Generic Firestore Service
class FirestoreService<T> {
  FirestoreService(this._firestore);
  final FirebaseFirestore _firestore;

  /// Get a stream of a typed collection
  Stream<List<T>> getCollectionStream(
    String collectionPath, {
    required T Function(Map<String, dynamic> data) fromJson,
    String identifierKey = 'id',
  }) {
    try {
      return _firestore.collection(collectionPath).snapshots().map((snapshot) {
        return snapshot.docs
            .map((doc) => fromJson(doc.data()..[identifierKey] = doc.id))
            .toList();
      });
    } on FirebaseException catch (e, st) {
      Error.throwWithStackTrace(
        FirestoreException(
          'Error getting Stream collection: ${e.message}',
          FirestoreErrorType.readError,
        ),
        st,
      );
    }
  }

  /// Get a future of a typed collection
  Future<List<T>> getCollectionFuture(
    String collectionPath, {
    required T Function(Map<String, dynamic> data) fromJson,
    String identifierKey = 'id',
  }) async {
    try {
      final snapshot = await _firestore.collection(collectionPath).get();
      return snapshot.docs
          .map((doc) => fromJson(doc.data()..[identifierKey] = doc.id))
          .toList();
    } on FirebaseException catch (e, st) {
      Error.throwWithStackTrace(
        FirestoreException(
          'Error getting future collection: ${e.message}',
          FirestoreErrorType.readError,
        ),
        st,
      );
    }
  }

  /// Add a document
  Future<void> addDocument({
    required String collectionPath,
    required String documentId,
    required Map<String, dynamic> data,
  }) async {
    try {
      await _firestore.collection(collectionPath).doc(documentId).set(data);
    } on FirebaseException catch (e, st) {
      Error.throwWithStackTrace(
        FirestoreException(
          'Error adding a doc: ${e.message}',
          FirestoreErrorType.addError,
        ),
        st,
      );
    }
  }

  /// Update a document
  Future<void> updateDocument({
    required String collectionPath,
    required String documentId,
    required Map<String, dynamic> data,
  }) async {
    try {
      await _firestore.collection(collectionPath).doc(documentId).update(data);
    } on FirebaseException catch (e, st) {
      Error.throwWithStackTrace(
        FirestoreException(
          'Error updating a doc: ${e.message}',
          FirestoreErrorType.updateError,
        ),
        st,
      );
    }
  }

  /// Delete a document
  Future<void> deleteDocument({
    required String collectionPath,
    required String documentId,
  }) async {
    try {
      await _firestore.collection(collectionPath).doc(documentId).delete();
    } on FirebaseException catch (e, st) {
      Error.throwWithStackTrace(
        FirestoreException(
          'Error deleting a doc: ${e.message}',
          FirestoreErrorType.deleteError,
        ),
        st,
      );
    }
  }
}

@riverpod
FirebaseFirestore firebaseFirestore(Ref ref) => FirebaseFirestore.instance;
