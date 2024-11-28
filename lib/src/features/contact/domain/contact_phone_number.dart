import 'package:freezed_annotation/freezed_annotation.dart';
part 'contact_phone_number.freezed.dart';
part 'contact_phone_number.g.dart';

@freezed
class ContactPhoneNumber with _$ContactPhoneNumber {
  const factory ContactPhoneNumber({
    required String countryCode,
    required String phoneNumber,
  }) = _ContactPhoneNumber;

  factory ContactPhoneNumber.fromJson(Map<String, dynamic> json) =>
      _$ContactPhoneNumberFromJson(json);
}
