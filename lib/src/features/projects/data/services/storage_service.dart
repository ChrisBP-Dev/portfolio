import 'package:firebase_storage/firebase_storage.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
part 'storage_service.g.dart';

/// Types of errors that can occur in the storage service.
enum StorageErrorType {
  uploadError,
  deleteError,
}

/// Exception thrown by the storage service.
class StorageException implements Exception {
  const StorageException(this.message, this.errorType);

  final String message;
  final StorageErrorType errorType;

  @override
  String toString() => 'StorageException [$errorType]:/\n$message';
}

class StorageService {
  const StorageService(this._firebaseStorage);
  final FirebaseStorage _firebaseStorage;

  /// Method to upload an image to Firebase Storage
  Future<String> uploadImage(Uint8List imageBytes, String path) async {
    try {
      final ref = _firebaseStorage.ref().child(path);
      final uploadTask = await ref.putData(imageBytes);
      return await uploadTask.ref.getDownloadURL();
    } on FirebaseException catch (e, st) {
      Error.throwWithStackTrace(
        StorageException('$e', StorageErrorType.uploadError),
        st,
      );
    }
  }

  /// Method to delete an image from Firebase Storage
  Future<void> deleteImage(String path) async {
    try {
      final ref = _firebaseStorage.ref().child(path);
      await ref.delete();
    } on FirebaseException catch (e, st) {
      Error.throwWithStackTrace(
        StorageException('$e', StorageErrorType.deleteError),
        st,
      );
    }
  }
}

@riverpod
FirebaseStorage firebaseStorage(Ref ref) => FirebaseStorage.instance;

@riverpod
StorageService storageService(Ref ref) {
  return StorageService(ref.watch(firebaseStorageProvider));
}
