import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:portfolio/src/core/common_widgets/custom_title_on_component.dart';
import 'package:portfolio/src/core/common_widgets/responsive_center.dart';
import 'package:portfolio/src/core/constants/app_sizes.dart';
import 'package:portfolio/src/core/constants/business_information.dart';
import 'package:portfolio/src/core/utils/theme/color_app.dart';
import 'package:portfolio/src/core/utils/theme/theme_extension.dart';
import 'package:portfolio/src/features/social_launcher/presentation/social_buttons.dart';
import 'package:portfolio/src/localization/l10n.dart';
import 'package:portfolio/src/routing/admin_app_route.dart';

class FooterComponent extends StatelessWidget {
  const FooterComponent({super.key});

  @override
  Widget build(BuildContext context) {
    return SliverToBoxAdapter(
      child: ColoredBox(
        color: context.theme.cardColor,
        child: ResponsiveCenter(
          padding: const EdgeInsets.symmetric(horizontal: Sizes.globalPadding),
          child: Column(
            children: [
              gapH39,
              CustomTitleOnComponent(
                title: context.l10n.contactTitle,
                gradientLight: AppColor.textGreyGradientDark,
                gradientDark: AppColor.textGreyGradientDark,
              ),
              gapH20,
              const SocialButtons(),
              gapH39,
              GestureDetector(
                child: const Text(BusinessInformation.reservedInfo),
                onDoubleTap: () {
                  context.go(AdminAppRoute.adminTechnologies.path);
                },
              ),
              gapH39,
            ],
          ),
        ),
      ),
    );
  }
}
