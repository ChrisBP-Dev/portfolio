import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio/src/features/auth/domain/admin.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
part 'firebase_auth_service.g.dart';

/// Custom Exception for FirebaseAuth
class FirebaseAuthException implements Exception {
  const FirebaseAuthException(this.message, this.errorType);
  final String message;
  final FirebaseAuthErrorType errorType;

  @override
  String toString() => 'FirebaseAuthException [$errorType]:\n$message';
}

enum FirebaseAuthErrorType {
  signInWithEmailAndPasswordError,
  signOutError,
}

/// Firebase Auth Service
class FirebaseAuthService {
  FirebaseAuthService(this._firebaseAuth);
  final FirebaseAuth _firebaseAuth;

  Admin? get currentUser => _getUserFromFirebaseUser(_firebaseAuth.currentUser);

  Stream<Admin?> authStateChanges() {
    return _firebaseAuth.authStateChanges().map(_getUserFromFirebaseUser);
  }

  Future<Admin> signInWithEmailAndPassword(
    String email,
    String password,
  ) async {
    try {
      final user = await _firebaseAuth.signInWithEmailAndPassword(
        email: email,
        password: password,
      );
      return Admin(
        uid: user.user!.uid,
        email: user.user!.email!,
      );
    } on FirebaseException catch (e, st) {
      Error.throwWithStackTrace(
        FirebaseAuthException(
          'Error signInWithEmailAndPassword - Method: ${e.message}',
          FirebaseAuthErrorType.signInWithEmailAndPasswordError,
        ),
        st,
      );
    }
  }

  Future<void> signOut() async {
    try {
      await _firebaseAuth.signOut();
    } on FirebaseException catch (e, st) {
      Error.throwWithStackTrace(
        FirebaseAuthException(
          'Error signOut - Method: ${e.message}',
          FirebaseAuthErrorType.signOutError,
        ),
        st,
      );
    }
  }

  Admin? _getUserFromFirebaseUser(User? user) {
    if (user == null) return null;
    return Admin(uid: user.uid, email: user.email!);
  }
}

@riverpod
FirebaseAuth firebaseAuth(Ref ref) => FirebaseAuth.instance;

@riverpod
FirebaseAuthService firebaseAuthService(Ref ref) {
  return FirebaseAuthService(ref.watch(firebaseAuthProvider));
}
