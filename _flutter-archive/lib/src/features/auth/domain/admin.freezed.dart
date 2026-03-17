// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'admin.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

Admin _$AdminFromJson(Map<String, dynamic> json) {
  return _Admin.fromJson(json);
}

/// @nodoc
mixin _$Admin {
  String get uid => throw _privateConstructorUsedError;
  String get email => throw _privateConstructorUsedError;

  /// Serializes this Admin to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of Admin
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $AdminCopyWith<Admin> get copyWith => throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $AdminCopyWith<$Res> {
  factory $AdminCopyWith(Admin value, $Res Function(Admin) then) =
      _$AdminCopyWithImpl<$Res, Admin>;
  @useResult
  $Res call({String uid, String email});
}

/// @nodoc
class _$AdminCopyWithImpl<$Res, $Val extends Admin>
    implements $AdminCopyWith<$Res> {
  _$AdminCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of Admin
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? uid = null,
    Object? email = null,
  }) {
    return _then(_value.copyWith(
      uid: null == uid
          ? _value.uid
          : uid // ignore: cast_nullable_to_non_nullable
              as String,
      email: null == email
          ? _value.email
          : email // ignore: cast_nullable_to_non_nullable
              as String,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$AdminImplCopyWith<$Res> implements $AdminCopyWith<$Res> {
  factory _$$AdminImplCopyWith(
          _$AdminImpl value, $Res Function(_$AdminImpl) then) =
      __$$AdminImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String uid, String email});
}

/// @nodoc
class __$$AdminImplCopyWithImpl<$Res>
    extends _$AdminCopyWithImpl<$Res, _$AdminImpl>
    implements _$$AdminImplCopyWith<$Res> {
  __$$AdminImplCopyWithImpl(
      _$AdminImpl _value, $Res Function(_$AdminImpl) _then)
      : super(_value, _then);

  /// Create a copy of Admin
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? uid = null,
    Object? email = null,
  }) {
    return _then(_$AdminImpl(
      uid: null == uid
          ? _value.uid
          : uid // ignore: cast_nullable_to_non_nullable
              as String,
      email: null == email
          ? _value.email
          : email // ignore: cast_nullable_to_non_nullable
              as String,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$AdminImpl implements _Admin {
  const _$AdminImpl({required this.uid, required this.email});

  factory _$AdminImpl.fromJson(Map<String, dynamic> json) =>
      _$$AdminImplFromJson(json);

  @override
  final String uid;
  @override
  final String email;

  @override
  String toString() {
    return 'Admin(uid: $uid, email: $email)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$AdminImpl &&
            (identical(other.uid, uid) || other.uid == uid) &&
            (identical(other.email, email) || other.email == email));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, uid, email);

  /// Create a copy of Admin
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$AdminImplCopyWith<_$AdminImpl> get copyWith =>
      __$$AdminImplCopyWithImpl<_$AdminImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$AdminImplToJson(
      this,
    );
  }
}

abstract class _Admin implements Admin {
  const factory _Admin(
      {required final String uid, required final String email}) = _$AdminImpl;

  factory _Admin.fromJson(Map<String, dynamic> json) = _$AdminImpl.fromJson;

  @override
  String get uid;
  @override
  String get email;

  /// Create a copy of Admin
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$AdminImplCopyWith<_$AdminImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
