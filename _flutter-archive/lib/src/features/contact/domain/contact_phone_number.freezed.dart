// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'contact_phone_number.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

ContactPhoneNumber _$ContactPhoneNumberFromJson(Map<String, dynamic> json) {
  return _ContactPhoneNumber.fromJson(json);
}

/// @nodoc
mixin _$ContactPhoneNumber {
  String get countryCode => throw _privateConstructorUsedError;
  String get phoneNumber => throw _privateConstructorUsedError;

  /// Serializes this ContactPhoneNumber to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of ContactPhoneNumber
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $ContactPhoneNumberCopyWith<ContactPhoneNumber> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $ContactPhoneNumberCopyWith<$Res> {
  factory $ContactPhoneNumberCopyWith(
          ContactPhoneNumber value, $Res Function(ContactPhoneNumber) then) =
      _$ContactPhoneNumberCopyWithImpl<$Res, ContactPhoneNumber>;
  @useResult
  $Res call({String countryCode, String phoneNumber});
}

/// @nodoc
class _$ContactPhoneNumberCopyWithImpl<$Res, $Val extends ContactPhoneNumber>
    implements $ContactPhoneNumberCopyWith<$Res> {
  _$ContactPhoneNumberCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of ContactPhoneNumber
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? countryCode = null,
    Object? phoneNumber = null,
  }) {
    return _then(_value.copyWith(
      countryCode: null == countryCode
          ? _value.countryCode
          : countryCode // ignore: cast_nullable_to_non_nullable
              as String,
      phoneNumber: null == phoneNumber
          ? _value.phoneNumber
          : phoneNumber // ignore: cast_nullable_to_non_nullable
              as String,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$ContactPhoneNumberImplCopyWith<$Res>
    implements $ContactPhoneNumberCopyWith<$Res> {
  factory _$$ContactPhoneNumberImplCopyWith(_$ContactPhoneNumberImpl value,
          $Res Function(_$ContactPhoneNumberImpl) then) =
      __$$ContactPhoneNumberImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String countryCode, String phoneNumber});
}

/// @nodoc
class __$$ContactPhoneNumberImplCopyWithImpl<$Res>
    extends _$ContactPhoneNumberCopyWithImpl<$Res, _$ContactPhoneNumberImpl>
    implements _$$ContactPhoneNumberImplCopyWith<$Res> {
  __$$ContactPhoneNumberImplCopyWithImpl(_$ContactPhoneNumberImpl _value,
      $Res Function(_$ContactPhoneNumberImpl) _then)
      : super(_value, _then);

  /// Create a copy of ContactPhoneNumber
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? countryCode = null,
    Object? phoneNumber = null,
  }) {
    return _then(_$ContactPhoneNumberImpl(
      countryCode: null == countryCode
          ? _value.countryCode
          : countryCode // ignore: cast_nullable_to_non_nullable
              as String,
      phoneNumber: null == phoneNumber
          ? _value.phoneNumber
          : phoneNumber // ignore: cast_nullable_to_non_nullable
              as String,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$ContactPhoneNumberImpl implements _ContactPhoneNumber {
  const _$ContactPhoneNumberImpl(
      {required this.countryCode, required this.phoneNumber});

  factory _$ContactPhoneNumberImpl.fromJson(Map<String, dynamic> json) =>
      _$$ContactPhoneNumberImplFromJson(json);

  @override
  final String countryCode;
  @override
  final String phoneNumber;

  @override
  String toString() {
    return 'ContactPhoneNumber(countryCode: $countryCode, phoneNumber: $phoneNumber)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$ContactPhoneNumberImpl &&
            (identical(other.countryCode, countryCode) ||
                other.countryCode == countryCode) &&
            (identical(other.phoneNumber, phoneNumber) ||
                other.phoneNumber == phoneNumber));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, countryCode, phoneNumber);

  /// Create a copy of ContactPhoneNumber
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$ContactPhoneNumberImplCopyWith<_$ContactPhoneNumberImpl> get copyWith =>
      __$$ContactPhoneNumberImplCopyWithImpl<_$ContactPhoneNumberImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$ContactPhoneNumberImplToJson(
      this,
    );
  }
}

abstract class _ContactPhoneNumber implements ContactPhoneNumber {
  const factory _ContactPhoneNumber(
      {required final String countryCode,
      required final String phoneNumber}) = _$ContactPhoneNumberImpl;

  factory _ContactPhoneNumber.fromJson(Map<String, dynamic> json) =
      _$ContactPhoneNumberImpl.fromJson;

  @override
  String get countryCode;
  @override
  String get phoneNumber;

  /// Create a copy of ContactPhoneNumber
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$ContactPhoneNumberImplCopyWith<_$ContactPhoneNumberImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
