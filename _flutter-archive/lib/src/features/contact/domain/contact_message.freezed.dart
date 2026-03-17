// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'contact_message.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

ContactMessage _$ContactMessageFromJson(Map<String, dynamic> json) {
  return _ContactMessage.fromJson(json);
}

/// @nodoc
mixin _$ContactMessage {
  String get name => throw _privateConstructorUsedError;
  String get email => throw _privateConstructorUsedError;
  String get message => throw _privateConstructorUsedError;
  ContactPhoneNumber get phoneNumber => throw _privateConstructorUsedError;
  SendThrough get sendThrough => throw _privateConstructorUsedError;

  /// Serializes this ContactMessage to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of ContactMessage
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $ContactMessageCopyWith<ContactMessage> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $ContactMessageCopyWith<$Res> {
  factory $ContactMessageCopyWith(
          ContactMessage value, $Res Function(ContactMessage) then) =
      _$ContactMessageCopyWithImpl<$Res, ContactMessage>;
  @useResult
  $Res call(
      {String name,
      String email,
      String message,
      ContactPhoneNumber phoneNumber,
      SendThrough sendThrough});

  $ContactPhoneNumberCopyWith<$Res> get phoneNumber;
}

/// @nodoc
class _$ContactMessageCopyWithImpl<$Res, $Val extends ContactMessage>
    implements $ContactMessageCopyWith<$Res> {
  _$ContactMessageCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of ContactMessage
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? name = null,
    Object? email = null,
    Object? message = null,
    Object? phoneNumber = null,
    Object? sendThrough = null,
  }) {
    return _then(_value.copyWith(
      name: null == name
          ? _value.name
          : name // ignore: cast_nullable_to_non_nullable
              as String,
      email: null == email
          ? _value.email
          : email // ignore: cast_nullable_to_non_nullable
              as String,
      message: null == message
          ? _value.message
          : message // ignore: cast_nullable_to_non_nullable
              as String,
      phoneNumber: null == phoneNumber
          ? _value.phoneNumber
          : phoneNumber // ignore: cast_nullable_to_non_nullable
              as ContactPhoneNumber,
      sendThrough: null == sendThrough
          ? _value.sendThrough
          : sendThrough // ignore: cast_nullable_to_non_nullable
              as SendThrough,
    ) as $Val);
  }

  /// Create a copy of ContactMessage
  /// with the given fields replaced by the non-null parameter values.
  @override
  @pragma('vm:prefer-inline')
  $ContactPhoneNumberCopyWith<$Res> get phoneNumber {
    return $ContactPhoneNumberCopyWith<$Res>(_value.phoneNumber, (value) {
      return _then(_value.copyWith(phoneNumber: value) as $Val);
    });
  }
}

/// @nodoc
abstract class _$$ContactMessageImplCopyWith<$Res>
    implements $ContactMessageCopyWith<$Res> {
  factory _$$ContactMessageImplCopyWith(_$ContactMessageImpl value,
          $Res Function(_$ContactMessageImpl) then) =
      __$$ContactMessageImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String name,
      String email,
      String message,
      ContactPhoneNumber phoneNumber,
      SendThrough sendThrough});

  @override
  $ContactPhoneNumberCopyWith<$Res> get phoneNumber;
}

/// @nodoc
class __$$ContactMessageImplCopyWithImpl<$Res>
    extends _$ContactMessageCopyWithImpl<$Res, _$ContactMessageImpl>
    implements _$$ContactMessageImplCopyWith<$Res> {
  __$$ContactMessageImplCopyWithImpl(
      _$ContactMessageImpl _value, $Res Function(_$ContactMessageImpl) _then)
      : super(_value, _then);

  /// Create a copy of ContactMessage
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? name = null,
    Object? email = null,
    Object? message = null,
    Object? phoneNumber = null,
    Object? sendThrough = null,
  }) {
    return _then(_$ContactMessageImpl(
      name: null == name
          ? _value.name
          : name // ignore: cast_nullable_to_non_nullable
              as String,
      email: null == email
          ? _value.email
          : email // ignore: cast_nullable_to_non_nullable
              as String,
      message: null == message
          ? _value.message
          : message // ignore: cast_nullable_to_non_nullable
              as String,
      phoneNumber: null == phoneNumber
          ? _value.phoneNumber
          : phoneNumber // ignore: cast_nullable_to_non_nullable
              as ContactPhoneNumber,
      sendThrough: null == sendThrough
          ? _value.sendThrough
          : sendThrough // ignore: cast_nullable_to_non_nullable
              as SendThrough,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$ContactMessageImpl implements _ContactMessage {
  const _$ContactMessageImpl(
      {required this.name,
      required this.email,
      required this.message,
      required this.phoneNumber,
      this.sendThrough = SendThrough.whatsapp});

  factory _$ContactMessageImpl.fromJson(Map<String, dynamic> json) =>
      _$$ContactMessageImplFromJson(json);

  @override
  final String name;
  @override
  final String email;
  @override
  final String message;
  @override
  final ContactPhoneNumber phoneNumber;
  @override
  @JsonKey()
  final SendThrough sendThrough;

  @override
  String toString() {
    return 'ContactMessage(name: $name, email: $email, message: $message, phoneNumber: $phoneNumber, sendThrough: $sendThrough)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$ContactMessageImpl &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.email, email) || other.email == email) &&
            (identical(other.message, message) || other.message == message) &&
            (identical(other.phoneNumber, phoneNumber) ||
                other.phoneNumber == phoneNumber) &&
            (identical(other.sendThrough, sendThrough) ||
                other.sendThrough == sendThrough));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode =>
      Object.hash(runtimeType, name, email, message, phoneNumber, sendThrough);

  /// Create a copy of ContactMessage
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$ContactMessageImplCopyWith<_$ContactMessageImpl> get copyWith =>
      __$$ContactMessageImplCopyWithImpl<_$ContactMessageImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$ContactMessageImplToJson(
      this,
    );
  }
}

abstract class _ContactMessage implements ContactMessage {
  const factory _ContactMessage(
      {required final String name,
      required final String email,
      required final String message,
      required final ContactPhoneNumber phoneNumber,
      final SendThrough sendThrough}) = _$ContactMessageImpl;

  factory _ContactMessage.fromJson(Map<String, dynamic> json) =
      _$ContactMessageImpl.fromJson;

  @override
  String get name;
  @override
  String get email;
  @override
  String get message;
  @override
  ContactPhoneNumber get phoneNumber;
  @override
  SendThrough get sendThrough;

  /// Create a copy of ContactMessage
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$ContactMessageImplCopyWith<_$ContactMessageImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
